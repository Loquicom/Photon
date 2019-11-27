let platform;

switch (process.platform) {
    case 'linux':
        platform = require('./linux');
        break;
    case 'win32':
        platform = require('./windows');
        break;
    default:
        throw new Error('unknow platform: ' + process.platform);
}

module.exports = platform;