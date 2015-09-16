/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 */
'use strict';

var bookController = require('./controllers/bookController'),
    crowdController = require('./controllers/crowdController'),
    userController = require('./controllers/userController');

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
        next();
    });

    // Book v1 API: /v1/book
    app.route('/api/v1/book')
        .put(bookController.createNew)
        .get(bookController.getAll);
    app.get('/api/v1/book/:isbn', bookController.getWithISBN);
    app.get('/api/v1/book/:isbn/:owner', bookController.getWithISBNAndOwner);
    app.put('/api/v1/book/:isbn/:owner/addrenter', function(req, res){
        req.params.username = req.body.username; // Restructure to be able to use latest controller method
        bookController.addRenter(req, res);
    });
    app.put('/api/v1/book/:isbn/:owner/removerenter', function(req, res){
        req.params.username = req.body.username; // Restructure to be able to use latest controller method
        bookController.removeRenter(req, res);
    });

    // User API v1: /v1/user
    app.get('/api/v1/user/:username', userController.getUser);


    // Crowd API v1 /v1/crowd
    app.post('/api/v1/crowd', crowdController.create);

    app.put('/api/v1/crowd/:crowdId/addmember', crowdController.addMember);
    app.put('/api/v1/crowd/:crowdId/removemember', crowdController.removeMember);
    app.get('/api/v1/crowd', crowdController.getAll);
    app.get('/api/v1/crowd/:crowdId',crowdController.get);

    // Book API v2: /books
    app.route('/api/books')
        .put(bookController.createNew)
        .get(bookController.getAll);
    app.get('/api/books/:isbn', bookController.getWithISBN);
    app.get('/api/books/:isbn/:owner', bookController.getWithISBNAndOwner);
    app.route('/api/books/:isbn/:owner/renter/:username')
        .put(bookController.addRenter)
        .delete(bookController.removeRenter);

    // User API v2: /users
    app.get('/api/users/:username', userController.getUser);

    // Crowd API v2: /crowds
    app.post('/api/crowd', crowdController.create);

    app.put('/api/crowd/:crowdId/addmember', crowdController.addMember);

    app.put('/api/crowd/:crowdId/removemember', crowdController.removeMember);
    app.get('/api/crowd', crowdController.getAll);
    app.get('/api/crowd/:crowdId',crowdController.get);
}

exports.setup = setup;