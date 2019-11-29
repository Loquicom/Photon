const {exec} = require('child_process');
const pf = require('portfinder');
const file = require('./lib/file');

function getPhpVer(path = '') {
    return new Promise(resolve => {
        exec(path + 'php -v', (err, stdout) => {
            if (err) {
                resolve(undefined);
                return;
            }
            const version = stdout.split('(')[0].replace('PHP', '').trim();
            resolve(version);
        });
    });
}

module.exports.php = async function (localpath = './') {
    let ver;
    if (file.exist(localpath + 'bin/php')) {
        ver = await getPhpVer(localpath + 'bin/php/');
        if (ver !== undefined) {
            return {
                'version': ver,
                'local': true
            };
        }
    }
    ver = await getPhpVer();
    if (ver) {
        return {
            'version': ver,
            'local': false
        };
    }
    return undefined;
};

module.exports.port = async function (num = 1, start = undefined) {
    start = start || Math.floor(Math.random() * 2000) + 49152;
    let result = [];
    for (let i = 0; i < num; i++) {
        if (i > 0) {
            start = result[i - 1] + 1;
        }
        pf.basePort = start;
        result.push(await pf.getPortPromise());
    }
    return result;
};