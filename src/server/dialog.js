const {dialog} = require('electron');
const func = require('./function');
const PATH = '/dialog';

function path(path = '') {
    return func.path(PATH, path);
}

/**
 * 
 * @param {*} type 
 * @param {*} options Object: 
 *  - title (String): Title for the dialog
 *  - message (string): Messge to show in the dialog
 *  - buttons (Array): 1 to n buttons to show
 *  - checkbox (Object optional): two attribute label (String), the name and check (Boolean), the default value
 *  - default (String|int optional): Default button selected (name or index)
 *  - cancel (String|int optional): Default cancel button (name or index)
 * @param {*} callback 
 */
function openDialog(type, options, callback) {
    const opts = {
        'type': type,
        'title': options.title,
        'message': options.message,
        'buttons': options.buttons
    }
    // Add optional parameter
    let checkbox = false;
    if (options.checkbox !== undefined && options.checkbox.label !== undefined && options.checkbox.check !== undefined) {
        opts.checkboxLabel = options.checkbox.label;
        opts.checkboxChecked = options.checkbox.check;
        checkbox = true;
    }
    if (options.default !== undefined) {
        opts.defaultId = options.buttons.indexOf(options.default);
        if (opts.defaultId === -1) {
            opts.defaultId = options.default;
        }
    }
    if (options.cancel !== undefined) {
        opts.cancelId = options.buttons.indexOf(options.cancel);
        if (opts.cancelId === -1) {
            opts.cancelId = options.default;
        }
    }
    // Show dialog
    dialog.showMessageBox(opts).then(result => {
        const res = {success: true, index: result.response, result: options.buttons[result.response]};
        if (checkbox) {
            res.checkbox = result.checkboxChecked;
        }
        callback(res);
    });
}

module.exports.setup = function(server) {

    server.use(path("/error"), [func.verify, (req, res) => {
        if (req.body.title === undefined || req.body.message === undefined) {
            res.json({success: false, error: 'title and/or message missing'});
        } else {
            if (req.body.buttons !== undefined && Array.isArray(req.body.buttons)) {
                openDialog('error', req.body, (result) => {
                    res.json(result);
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
            openDialog('info', req.body, (result) => {
                res.json(result);
            });
        }
    }]);

    server.use(path("/question"), [func.verify, (req, res) => {
        if (req.body.title === undefined || req.body.message === undefined || req.body.buttons === undefined) {
            res.json({success: false, error: 'title and/or message missing'});
        } else if (!Array.isArray(req.body.buttons)) {
            res.json({success: false, error: 'buttons must be an array'})
        } else {
            openDialog('question', req.body, (result) => {
                res.json(result);
            });
        }
    }]);

    server.use(path("/warning"), [func.verify, (req, res) => {
        if (req.body.title === undefined || req.body.message === undefined || req.body.buttons === undefined) {
            res.json({success: false, error: 'title and/or message missing'});
        } else if (!Array.isArray(req.body.buttons)) {
            res.json({success: false, error: 'buttons must be an array'})
        } else {
            openDialog('warning', req.body, (result) => {
                res.json(result);
            });
        }
    }]);

};

