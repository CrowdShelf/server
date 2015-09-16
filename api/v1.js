/**
 * Created by esso on 16.09.15.
 */

var Books = require('../models/book.js');

var setup = function(app, bookController, crowdController, userController){
    // Book v1 API: /v1/book
    app.route('/api/v1/book')
        .put(bookController.createNew)
        .get(bookController.getAll);
    app.get('/api/v1/book/:isbn', bookController.getWithISBN);
    app.get('/api/v1/book/:isbn/:owner', bookController.getWithISBNAndOwner);
    app.put('/api/v1/book/:isbn/:owner/addrenter', function(req, res){
        req.params.username = req.body.username; // Restructure to be able to use latest controller method
        Books.findWithISBNAndOwner(req.params.isbn, req.params.owner, function(result){
            req.params.bookId = result._id;
            bookController.addRenter(req, res);
        });
    });

    app.put('/api/v1/book/:isbn/:owner/removerenter', function(req, res){
        req.params.username = req.body.username; // Restructure to be able to use latest controller method
        Books.findWithISBNAndOwner(req.params.isbn, req.params.owner, function(result){
            req.params.bookId = result._id;
            bookController.removeRenter(req, res);
        });
    });

    // User API v1: /v1/user
    app.get('/api/v1/user/:username', userController.getUser);


    // Crowd API v1 /v1/crowd
    app.post('/api/v1/crowd', crowdController.create);

    app.put('/api/v1/crowd/:crowdId/addmember', function(req, res){
        req.params.username = req.body.username; // Move to keep up with latest implementation
        crowdController.addMember
    });
    app.put('/api/v1/crowd/:crowdId/removemember', function(req, res){
        req.params.username = req.body.username;  // Move to keep up with latest implementation
        crowdController.removeMember(req, res);
    });
    app.get('/api/v1/crowd', crowdController.getAll);
    app.get('/api/v1/crowd/:crowdId',crowdController.get);
};

module.exports = {
    setup: setup
};