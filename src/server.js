const {dialog} = require('electron');
const express = require('express');
const server = express();

server.get('/', function (req, res) {
    dialog.showErrorBox('Title', 'Content');
    res.send('Ok');
});

module.exports.start = function (port) {
    server.listen(port);
    return server;
}