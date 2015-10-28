/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 */
'use strict';

var bookController = require('./controllers/bookController'),
    crowdController = require('./controllers/crowdController'),
    userController = require('./controllers/userController');

var express = require('express'),
    bodyParser = require('body-parser');

function setup(app){
    // Some setup for encoding of requests
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    app.use(function(req, res, next) { // Headers to allow CORS and different requests
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE, PUT');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('X-API-VERSION', 2);
        console.log(req.method+ '-request to: ' + req.url);
        next();
    });

    app.use('/api', express.static('public')); // Swagger location

    // Book API v2: /books
    app.route('/api/books')
        .post(bookController.create)
        .get(bookController.getBooks);
    app.route('/api/books/:bookId')
        .get(bookController.getWithID)
        .put(bookController.update)
        .delete(bookController.remove);
    app.route('/api/books/:bookId/renter/:username')
        .put(bookController.addRenter)
        .delete(bookController.removeRenter);

    // User API v2: /users
    app.route('/api/users/:userId')
        .get(userController.getUser)
        .delete(userController.remove);
    app.route('/api/users')
        .post(userController.create)
        .get(userController.getAllUsers);

    app.post('/api/login', userController.login);
    app.post('/api/login/:username/forgotpassword', userController.forgotPassword);

    app.route('/api/crowds')
        .post( crowdController.create)
        .get(crowdController.getCrowds);

    app.route('/api/crowds/:crowdId')
        .get(crowdController.getWithID)
        .put(crowdController.update)
        .delete(crowdController.remove);

    app.route('/api/crowds/:crowdId/members/:username')
        .put(crowdController.addMember)
        .delete(crowdController.removeMember);
}

exports.setup = setup;