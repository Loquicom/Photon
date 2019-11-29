const {app, shell} = require('electron');
const {spawn} = require('child_process');
const randomString = require('randomstring');
const file = require('./lib/file');
const platform = require('./platform');
const check = require('./check');
const server = require('./server');
const window = require('./window');
const config = require('../config');

// Action when install/uninstall on Windows
if (require('electron-squirrel-startup')) {
    app.quit();
}

// Constant
const photonVersion = '0.0.1';
const root = `${__dirname}/../`;
const version = process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1;
const serv = process.argv.indexOf('serv') !== -1;
const dev = process.argv.indexOf('dev') !== -1 || serv;

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
    if (version) {
        console.info('Photon version:', photonVersion);
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
    // Launch PHP an node server
    phpServ = spawn(php, ['-S', `localhost:${phpPort}`, '-t', `${root}app/`, `${__dirname}/php/controller.php`]);
    nodeServ = server.start(nodePort);
    // Generate json to share data with php
    file.put(`${__dirname}/../tmp/share.json`, JSON.stringify(share));
    // If in dev mode
    if (dev) {
        const url = `http://localhost:${phpPort}?__photon_token=${share.token}`;
        console.log('Application URL (open in web browser):', url);
        shell.openExternal(url);
    }
    // If browsers are allowed to navigate on the application
    else if (config.browser) {
        console.info('Application URL:', `http://localhost:${phpPort}`);
    }
    // Create window
    if(!serv) {
        mainWindow = window.loader();
        window.phpView(mainWindow, phpPort, share.token);
        mainWindow.on('closed', () => {
            mainWindow = null;
        });
    } 
}

// App actions
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
