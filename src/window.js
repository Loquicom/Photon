const {BrowserView, BrowserWindow} = require('electron');
const file = require('./lib/file');
const config = require('../config');
const window = {};

window.new = function (html) {
    const win = new BrowserWindow({
        width: config.window.width,
        height: config.window.height,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile(html);
    return win;
}

window.loader = function () {
    let html = `${__dirname}/view/loader.html`;
    if(config.window.loader.active) {   
        if(config.window.loader.custom) {
            if(file.exist(config.window.loader.custom)) {
                html = config.window.loader.custom;
            } else if (file.exist(__dirname + config.window.loader.custom)) {
                html = __dirname + config.window.loader.custom;
            } else if (file.exist(__dirname + '/' + config.window.loader.custom)) {
                html = __dirname + '/' + config.window.loader.custom;
            } else {
                console.error('Unable to find custom loader');
            }
        }
    } else {
        html = `${__dirname}/view/blank.html`
    }
    // Return window
    return window.new(html);
}

window.view = function (win, url) {
    const view = new BrowserView();
    win.setBrowserView(view);
    view.setBounds({x: 0, y: 0, width: config.window.width, height: config.window.height});
    view.webContents.loadURL(url);
    view.setAutoResize({
        width: true,
        height: true
    });
    return view;
}

window.phpView = function (win, phpPort, token) {
    return window.view(win, `http://localhost:${phpPort}?__photon_token=${token}`);
}

module.exports = window;