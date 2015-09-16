/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 */
'use strict';

var bookController = require('./controllers/bookController'),
    crowdController = require('./controllers/crowdController'),
    userController = require('./controllers/userController');

var apiv1 = require('./api/v1.js');

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

    // Setup APIv1
    apiv1.setup(app, bookController, crowdController, userController);

    // Book API v2: /books
    app.route('/api/books')
        .put(bookController.createNew)
        .get(bookController.getAll);
    app.get('/api/books/isbn/:isbn', bookController.getWithISBN);
    app.get('/api/books/:bookId', bookController.getWithID);
    app.route('/api/books/:bookId/renter/:username')
        .put(bookController.addRenter)
        .delete(bookController.removeRenter);

    // User API v2: /users
    app.get('/api/users/:username', userController.getUser);

    // Crowd API v2: /crowds
    app.post('/api/crowds', crowdController.create);

    app.route('/api/crowds/:crowdId/members/:username')
        .put(crowdController.addMember)
        .delete(crowdController.removeMember);

    app.get('/api/crowds', crowdController.getAll);
    app.get('/api/crowds/:crowdId',crowdController.get);
}

exports.setup = setup;