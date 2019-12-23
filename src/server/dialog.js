const {dialog} = require('electron');
const PATH = '/dialog';

function path(path) {
    if (path.length <= 0) {
        return PATH;
    }
    if (path[0] === '/') {
        return PATH + path;
    } else {
        return PATH + '/' + path;
    }
}

module.exports.setup = function(server) {

    server.use(path("/error"), function (req, res) {
        if (req.body.title === undefined || req.body.content === undefined) {
            res.json({success: false, error: 'title and/or content missing'});
        } else {
            dialog.showErrorBox(req.body.title, req.body.content);
            res.json({success: true})
        }
    });

};

