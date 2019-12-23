const func = {};

func.path = function (constPath, path = '') {
    if (constPath[0] !== '/') {
        constPath = '/' + constPath;
    }
    if (path.length <= 0) {
        path = '/:token';
    } else {
        if (path[path.length - 1] !== '/') {
            path += '/';
        }
        path += ':token';
    }
    if (path[0] === '/') {
        return constPath + path;
    } else {
        return constPath + '/' + path;
    }
}

func.verify = function (req, res, next) {
    if (req.params.token && req.params.token === getShare().token) {
        next();
        return;
    }
    res.json({success: false, error: 'Invalid token'});
}

module.exports = func;

let share = null;
function getShare() {
    if (share === null) {
        share = require(`../../tmp/share`);
    }
    return share;
}