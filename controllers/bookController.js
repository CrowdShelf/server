/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of book requests
 */

var Joi = require('joi');

var Books = require('../models/book'),
    userController = require('./userController'),
    stndResponse = require('../helpers/standardResponses.js');

var create = function(req, res){
    var book = req.body;
    checkForValidUserId(req.body.owner, res,function (result) {
        if(!result) return; // not valid
        Books.insert(book, function(result){ // Not there, so it can be created
            if(result.error) return res.json(result.error); // Just some error
            if(result.validationError) return stndResponse.unprocessableEntity(res, {error: result.validationError});
            if(result === 500) return stndResponse.internalError(res);
            return res.json(result);
        });
    });
};

var update = function(req, res){
    var book = req.body;
    checkForValidUserId(book.owner, res, function (result) {
        if(!result) return;
        return Books.updateBook(req.params.bookId, book, function(result){
            if(result.validationError) return stndResponse.unprocessableEntity(res, {error: result.validationError});
            if(result === 404) return stndResponse.notFound(res);
            res.json(result);
        });
    });
};

var remove = function (req, res) {
    Books.remove(req.params.bookId, function(result){
        if(result.result.ok === 1) return stndResponse.resourceDeleted(res);
        return stndResponse.notFound(res);
    });
};

var getBooks = function(req, res){
    var isbn = req.query.isbn ? req.query.isbn : null,
        owner = req.query.owner ? req.query.owner : null,
        rentedTo = req.query.rentedTo ? req.query.rentedTo : null;
    // Get with ISBN and owner
    if(isbn && owner && !rentedTo) return getWithISBNAndOwner(req, res);
    // if isbn, not owner or rentedTo: Find with isbn
    if(isbn && !owner && !rentedTo) return getWithISBN(req, res);
    // if owner not isbn: Find with owner
    if(!isbn && owner && !rentedTo) return getBooksOfOwner(req, res);
    // isbn and rentedTo
    if(!isbn && !owner && rentedTo) return getBooksRentedTo(req, res);
    // if all
    if(isbn && owner && rentedTo) return getWithISBNOwnedByRentedTo(req, res);
    // rentedTo and isbn
    if(isbn && !owner && rentedTo) return getWithISBNAndRentedTo(req, res);
    // rentedTo and owner
    if(!isbn && owner && rentedTo) return getBooksOfOwnerRentedTo(req, res);
    // if none: getAll
    return getAll(req, res);
};

var getBooksRentedTo = function (req, res) {
    var rentedTo = req.query.rentedTo;
    Books.findRentedTo(rentedTo, function (result) {
        res.json(formatResultForClient(result));
    });
};

var getWithISBNOwnedByRentedTo = function(req, res){
    var isbn = req.query.isbn,
        owner = req.query.owner,
        rentedTo = req.query.rentedTo;
    Books.findWithISBNOwnedByRentedTo(isbn, owner, rentedTo, function (result) {
       res.json(formatResultForClient(result));
    });
};

var getWithISBNAndRentedTo = function(req, res){
    var isbn = req.query.isbn,
        rentedTo = req.query.rentedTo;
    Books.findWithISBNRentedTo(isbn, rentedTo, function (result) {
        if( result === 422) return stndResponse.unprocessableEntity(res);
        if(result.error) return res.json({error: result.error});
        return res.json(formatResultForClient(result));
    });
};

var getBooksOfOwnerRentedTo = function(req, res){
    var owner = req.query.owner,
        rentedTo = req.query.rentedTo;
    Books.findWithOwnerAndRentedTo(owner, rentedTo, function (result) {
        res.json(formatResultForClient(result));
    });
};

var getWithISBN = function(req, res){
    var isbn = req.query.isbn;
    Books.findWithISBN(isbn, function(result){
        if (result === 404) result = []; // Nothing found
        res.json(formatResultForClient(result));
    });
};

var getBooksOfOwner = function (req, res){
    var owner = req.query.owner;
    Books.findWithOwner(owner, function(result){
        if (result === 404) result = []; // Nothing found
        res.json(formatResultForClient(result));
    });
};

var getWithISBNAndOwner = function(req, res){
    var isbn = req.query.isbn;
    var owner = req.query.owner;
    Books.findWithISBNAndOwner(isbn, owner, function(result){
        if (result === 404) result = []; // Nothing found
        res.json(formatResultForClient(result));
    });
};

var getWithID = function(req, res){
    var id = req.params.bookId;
    Books.findWithID(id, function(result){
        if(result === 404) return res.status(404).send('Book not found.');
        if(result === 422) return res.status(422).send('Invalid bookId');
        res.json(result);
    });
};

var addRenter = function(req, res){
    checkForValidUserId(req.params.username, res, function (result) {
        if(!result) return; // Not valid
        Books.addRenter(req.params.bookId, req.params.username, function (result) {
            if (result.error) {
                return res
                    .status(404)
                    .send('Did not identify a book with that ID.');
            }
            return res.json(result);
        });
    });
};

var removeRenter = function(req, res){
    Books.removeRenter(req.params.bookId, req.params.username, function(result){
        if(result.error) {
            return res
                .status(404)
                .send('Did not identify a book with that ID. ');
        }
        return res.json(result);
    });
};

var getAll = function(req, res){
    Books.findAll(function(result){
        res.json(formatResultForClient(result));
    });
};

/*
 * checkForValidUserId
 * @description Checks if valid userId, sends stndResponse unproccesable if not.
 * @param String userId
 * @param Object res
 * @param function callback
 * @returns callback(boolean)
 */
var checkForValidUserId = function (userId, res, callback) {
    userController.isValidUser(userId, function (result) {
        if (!result) {
            callback(false);
            stndResponse.unprocessableEntity(res, {error: 'Invalid userID.'});
        } else callback(true);
    });
};


var formatResultForClient = function (result) {
    return {books: result}
};


module.exports = {
    getAll: getAll,
    getBooks: getBooks,
    create:create,
    update: update,
    remove: remove,
    getWithID: getWithID,
    addRenter: addRenter,
    removeRenter: removeRenter
};