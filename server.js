/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 */
'use strict';

var express = require('express');
var router = require('./router');

var app = express();
function start() {
    router.setup(app); // Setup routes
    var port = process.env.PORT || 3000; // Configure port
    app.listen(port); // Listen for requests
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
}

exports.start = start;
exports.app = app;