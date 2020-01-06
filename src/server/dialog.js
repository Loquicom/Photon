const {dialog} = require('electron');
const func = require('./function');
const PATH = '/dialog';

function path(path = '') {
    return func.path(PATH, path);
}

module.exports.setup = function(server) {

    server.use(path("/error"), [func.verify, (req, res) => {
        if (req.body.title === undefined || req.body.message === undefined) {
            res.json({success: false, error: 'title and/or message missing'});
        } else {
            if (req.body.buttons !== undefined && Array.isArray(req.body.buttons)) {
                const options = {
                    'type': 'error',
                    'title': req.body.title,
                    'message': req.body.message,
                    'buttons': req.body.buttons
                }
                dialog.showMessageBox(options).then(index => {
                    res.json({success: true, index: index, result: req.body.buttons[index.response]});
                });
            } else {
                dialog.showErrorBox(req.body.title, req.body.message);
                res.json({success: true});
            }
        }
    }]);

    server.use(path("/information"), [func.verify, (req, res) => {
        if (req.body.title === undefined || req.body.message === undefined || req.body.buttons === undefined) {
            res.json({success: false, error: 'title and/or message missing'});
        } else if (!Array.isArray(req.body.buttons)) {
            res.json({success: false, error: 'buttons must be an array'})
        } else {
            const options = {
                'type': 'info',
                'title': req.body.title,
                'message': req.body.message,
                'buttons': req.body.buttons
            }
            dialog.showMessageBox(options).then(index => {
                res.json({success: true, index: index, result: req.body.buttons[index.response]});
            });
        }
    }]);

    server.use(path("/question"), [func.verify, (req, res) => {
        if (req.body.title === undefined || req.body.message === undefined || req.body.buttons === undefined) {
            res.json({success: false, error: 'title and/or message missing'});
        } else if (!Array.isArray(req.body.buttons)) {
            res.json({success: false, error: 'buttons must be an array'})
        } else {
            const options = {
                'type': 'question',
                'title': req.body.title,
                'message': req.body.message,
                'buttons': req.body.buttons
            }
            dialog.showMessageBox(options).then(index => {
                res.json({success: true, index: index, result: req.body.buttons[index.response]});
            });
        }
    }]);

    server.use(path("/warning"), [func.verify, (req, res) => {
        if (req.body.title === undefined || req.body.message === undefined || req.body.buttons === undefined) {
            res.json({success: false, error: 'title and/or message missing'});
        } else if (!Array.isArray(req.body.buttons)) {
            res.json({success: false, error: 'buttons must be an array'})
        } else {
            const options = {
                'type': 'warning',
                'title': req.body.title,
                'message': req.body.message,
                'buttons': req.body.buttons
            }
            dialog.showMessageBox(options).then(index => {
                res.json({success: true, index: index, result: req.body.buttons[index.response]});
            });
        }
    }]);

};

