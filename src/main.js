const {app, BrowserView, BrowserWindow} = require('electron');
const {spawn} = require('child_process');
const randomString = require('randomstring');
const check = require('./check');
const file = require('./lib/file');
const config = require('../config');

// Action when install/uninstall on Windows
if (require('electron-squirrel-startup')) {
    app.quit();
}

// Create tmp dir
file.makedir(`${__dirname}/../tmp/`);

// Main window
let mainWindow;
// PHP server
let phpServ;
// NOde server
let nodeServ;
// PHP server port
let phpPort;
// Node server port
let nodePort;
// Shared json with php
const share = {
    token: randomString.generate()
};

async function main() {
    // Check if PHP exist and get the version
    const php = await check.php();
    // Find port for the servers
    [phpPort, nodePort] = await check.port(2);
    share.port = {
        php: phpPort,
        node: nodePort
    };
    // Launch PHP server
    phpServ = spawn('php', ['-S', `localhost:${phpPort}`, '-t', `${__dirname}/../app/`, `${__dirname}/php/router.php`]);
    // Generate json to share data with php
    file.put(`${__dirname}/../tmp/share.json`, JSON.stringify(share));
    // If in dev mode
    if (process.argv.indexOf('dev') !== -1) {
        const url = `http://localhost:${phpPort}?__photon_token=${share.token}`;
        console.log('Application URL (open in web browser):', url);
        spawn('sensible-browser', [url]);
    }
    // If browsers are allowed to navigate on the application
    else if (config.browser) {
        console.info('Application URL:', `http://localhost:${phpPort}`);
    }
    // Create window
    createWindow();
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: config.window.width,
        height: config.window.height,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // and load the index.html of the app.
    mainWindow.loadFile(`${__dirname}/index.html`);
    // Call the php server
    let view = new BrowserView();
    mainWindow.setBrowserView(view);
    view.setBounds({x: 0, y: 0, width: 800, height: 600});
    view.webContents.loadURL(`http://localhost:${phpPort}?__photon_token=${share.token}`);
    view.setAutoResize({
        width: true,
        height: true
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', main);
app.on('window-all-closed', () => {
    spawn('kill', ['-9', phpServ.pid]);
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        phpServ = spawn('php', ['-S', `localhost:${phpPort}`, '-t', 'app/', `${__dirname}/php/router.php`]);
        createWindow();
    }
});
