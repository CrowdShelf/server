/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 */
'use strict';

var bookController = require('./controllers/bookController'),
    crowdController = require('./controllers/crowdController'),
    userController = require('./controllers/userController');

var express = require('express');

function setup(app){
    var bodyParser = require('body-parser'); // Some setup for encoding of requests
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    app.use(function(req, res, next) { // Headers to allow CORS and different requests
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('X-API-VERSION', 2);
        next();
    });

    app.use('/api', express.static('public'));

    // Book API v2: /books
    app.route('/api/books')
        .post(bookController.create)
        .put(bookController.update) // @TOOD
        .get(bookController.getBooks);  
    app.get('/api/books/:bookId', bookController.getWithID);
    app.route('/api/books/:bookId/renter/:username')
        .put(bookController.addRenter)
        .delete(bookController.removeRenter);

    // User API v2: /users
    app.get('/api/users/:id', userController.getUser);
    app.post('/api/users', userController.create);

    app.post('/api/crowds', crowdController.create);

    app.route('/api/crowds/:crowdId/members/:username')
        .put(crowdController.addMember)
        .delete(crowdController.removeMember);

    app.get('/api/crowds', crowdController.getCrowds);
    app.get('/api/crowds/:crowdId',crowdController.getWithID);
}

exports.setup = setup;