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
    var trimmedPath = path.replace(/^\/+|\/+$/g, ' ');

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

        // Send response to the user
        res.end('it works!');

        // Log message to the server
        console.log('Request Data: ', reqData);
    });
});

// Set the server to listen on port 3000
server.listen(3000, function () {
    console.log('Listening on port 3000');
})

