/**
 * Entry file for the application
 * Author: Jaime Alejandro A. Carvajal II
 * Date: January 29, 2021
 */

//  Dependencies
var http = require('http'); 
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// Create server and accepts incoming request
var server = http.createServer(function (req, res) {

    // Get the URL and parse it
    var parsedURL = url.parse(req.url, true);

    // Get the PATH
    var path = parsedURL.pathname; // untrimmed
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get query string as an object
    var queryStringObj = parsedURL.query;

    // Get HTTP method
    var method = req.method.toLowerCase();

    // Get request headers as an object
    var headers = req.headers;

    // Get payload
    var stringDecoder = new StringDecoder('utf-8'); // initialize StringDevoder obj
    var payload = ''; // data from the buffer stream

    req.on('data', function (data) { // Bind data event 
        payload += stringDecoder.write(data); // append string data to buffer
    });

    req.on('end', function () { // Bind end event 
        payload += stringDecoder.end(); // end decoder

        // Combine request data
        var reqData = {
            path    : trimmedPath,
            method  : method,
            query   : queryStringObj,
            headers : headers,
            payload : payload
        }
        
        // Log request data to the server
        console.log('Request Data: ', reqData);

        // Choose the handler
        var chosenHandler = typeof(routes[reqData.path]) !== 'undefined' ? routes[reqData.path] : handlers.routeNotFound;

        chosenHandler(reqData, function (statusCode, responseData) {

            // Check if status code send by the server is a number for sensible defaults (some handlers do not have responseData or status codes)
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Check if payload send by the server is an object for sensible defaults (some handlers do not have responseData or status codes)
            responseData = typeof(responseData) == 'object' ? responseData : {};

            // Convert payload to string 
            var responseDataString = JSON.stringify(responseData);

            // Send response to the user
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(responseDataString);

            // Log response message to the server
            console.log('Response Data: ', statusCode, responseDataString);
        });
    });
});

// Set the server to listen on port 3000
server.listen(3000, function () {
    console.log('Listening on port 3000');
});

// Route handlers
var handlers = {};

// Handler for sample route
handlers.sample = function (data, callback) {
    callback(200, {'sample' : 'sample data'});
};

// Handler for non existing routes
handlers.routeNotFound = function (data, callback) {
    callback(404);
};

// Routes
var routes = {
    'sample' : handlers.sample
}

