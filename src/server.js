const express = require('express');
const server = express();

// Read JSON in the request of the body
server.use(express.json());

// Loading all entry point
require('./entry/dialog').setup(server);

module.exports.start = function (port) {
    server.listen(port);
    return server;
}