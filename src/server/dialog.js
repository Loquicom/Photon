const {dialog} = require('electron');
const func = require('./function');
const PATH = '/dialog';

function path(path = '') {
    return func.path(PATH, path);
}

module.exports.setup = function(server) {

    server.use(path("/error"), [func.verify, (req, res) => {
        if (req.body.title === undefined || req.body.content === undefined) {
            res.json({success: false, error: 'title and/or content missing'});
        } else {
            dialog.showErrorBox(req.body.title, req.body.content);
            res.json({success: true})
        }
    }]);

};

