/**
 * Created by esso on 26.10.15.
 */
'use strict';
var emailTemplates = require('email-templates'),
    path           = require('path'),
    templateDir   = path.join(__dirname, '../emailTemplates');


var build = function (templateFolderName, valuesForTemplate, callback) {
    emailTemplates(templateDir, function (err, template) {
        if (err) return callback({error: err});

        // Send a single email
        template(templateFolderName, valuesForTemplate, function (err, html, text) {
            if (err) {
                return callback({error: err});
            }
            return callback({
                html: html,
                text: text
            });
        });
    });
};

module.exports = {
    build: build
};