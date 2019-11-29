const {app, BrowserView, BrowserWindow} = require('electron');
const {spawn, exec} = require('child_process');
const randomString = require('randomstring');
const platform = require('./platform');
const check = require('./check');
const file = require('./lib/file');
const config = require('../config');

// Action when install/uninstall on Windows
if (require('electron-squirrel-startup')) {
    app.quit();
}

// Constant
const root = `${__dirname}/../`;

// Create tmp dir
file.makedir(`${root}tmp/`);

// Main window
let mainWindow;
// PHP cli
let php;
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
    const phpInfo = await check.php(root);
    // If php is not found
    if (phpInfo === undefined) {
        console.info('PHP not found');
        app.quit();
        return;
    }
    // PHP local or global
    php = phpInfo.local ? `${root}bin/php/php` : 'php';
    // If param to show version
    if (process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1) {
        console.info('Photon version: 1.0.0');
        console.info('Electron version:', process.versions.electron);
        console.info('Node version:', process.versions.node);
        console.info('Chromium version:', process.versions.chrome);
        console.info('PHP version:', phpInfo.version);
        console.info('PHP is ' + (phpInfo.local ? '' : 'not ') + 'installed locally in the project');
        app.quit();
        return;
    }
    // Find port for the servers
    [phpPort, nodePort] = await check.port(2);
    share.port = {
        php: phpPort,
        node: nodePort
    };
    // Launch PHP server
    phpServ = spawn(php, ['-S', `localhost:${phpPort}`, '-t', `${root}app/`, `${__dirname}/php/router.php`]);
    // Generate json to share data with php
    file.put(`${__dirname}/../tmp/share.json`, JSON.stringify(share));
    // If in dev mode
    if (process.argv.indexOf('dev') !== -1) {
        const url = `http://localhost:${phpPort}?__photon_token=${share.token}`;
        console.log('Application URL (open in web browser):', url);
        exec(`${platform.cli.browser} ${url}`, (err) => {
            if(err) {
                console.error('Unable to open link in the web browser');
            }
        });
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
    // Load the html of the app.
    if(config.window.loader) {
        mainWindow.loadFile(`${__dirname}/view/loader.html`);
    } else {
        mainWindow.loadFile(`${__dirname}/view/blank.html`);
    }
    // Call the php server
    let view = new BrowserView();
    mainWindow.setBrowserView(view);
    view.setBounds({x: 0, y: 0, width: config.window.width, height: config.window.height});
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
    spawn(platform.cli.kill.cmd, [platform.cli.kill.arg , phpServ.pid]);
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        phpServ = spawn(php, ['-S', `localhost:${phpPort}`, '-t', 'app/', `${__dirname}/php/router.php`]);
        createWindow();
    }
});
