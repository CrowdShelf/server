/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of book requests
 */

var Joi = require('joi');

var Books = require('../models/book'),
    stndResponse = require('../helpers/standardResponses.js');

var create = function(req, res){
    var book = req.body;
    Books.insert(book, function(result){ // Not there, so it can be created
        if(result.error) return res.json(result.error); // Just some error
        if(result === 422) return stndResponse.unprocessableEntity(res);
        if(result === 500) return stndResponse.internalError(res);
        return res.json(result);
    });
};

var update = function(req, res){
    return res.send('Not implemented.');
    var book = req.body;
    if(!Books.isValid(book)) return res.sendStatus(422); // Unprocessable
    return Books.updateBook(req.params.bookId, book, function(result){
        if(result === 404) return res.sendStatus(404);
        res.json(result);
    })
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
        rentedTo = req.query.rentedTo ? req.query.owner : null;
    // Get with ISBN and owner
    if(isbn && owner && !rentedTo) return getWithISBNAndOwner(req, res);
    // if isbn, not owner or rentedTo: Find with isbn
    if(isbn && !owner && !rentedTo) return getWithISBN(req, res);
    // if owner not isbn: Find with owner
    if(!isbn && owner && !rentedTo) return getBooksOfOwner(req, res);
    // if all
    if(isbn && owner && rentedTo) return getWithISBNOwnedByRentedTo(req, res);
    // rentedTo and isbn
    if(isbn && !owner && rentedTo) return getWithISBNAndRentedTo(req, res);
    // rentedTo and owner
    if(!isbn && owner && rentedTo) return getBooksOfOwnerRentedTo(req, res);
    // if none: getAll
    return getAll(req, res);
};

var getWithISBNOwnedByRentedTo = function(req, res){
    stndResponse.notImplemented(res);
};

var getWithISBNAndRentedTo = function(req, res){
    stndResponse.notImplemented(res);
};

var getBooksOfOwnerRentedTo = function(req, res){
    stndResponse.notImplemented(res);
};

var getWithISBN = function(req, res){
    var isbn = req.query.isbn;
    Books.findWithISBN(isbn, function(result){
        if (result === 404){
            return res.sendStatus(404);  // not found
        }
        res.json({books: result});
    });
};

var getBooksOfOwner = function (req, res){
    var owner = req.query.owner;
    Books.findWithOwner(owner, function(result){
        if (result === 404) return res.sendStatus(404);
        res.json({books: result});
    });
};

var getWithISBNAndOwner = function(req, res){
    var isbn = req.query.isbn;
    var owner = req.query.owner;
    Books.findWithISBNAndOwner(isbn, owner, function(result){
        if (result === 404) return res.sendStatus(404);
        res.json(result);
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
    Books.addRenter(req.params.bookId, req.params.username, function(result){
        if(result === 404) {
            return res
                .status(404)
                .send('Did not identify a book with those parameteres. Check owner and ISBN.');
        }
        res.json(result);
    });
};

var removeRenter = function(req, res){
    Books.removeRenter(req.params.bookId, req.params.username, function(result){
        if(result === 404) {
            return res
                .status(404)
                .send('Did not identify a book with those parameteres. Check owner and ISBN.');
        }
        res.json(result);
    });
};

var getAll = function(req, res){
    Books.findAll(function(result){
        res.json({books: result});
    });
};



var addUsersToBooks = function(listOfBooks){
    for (var i = 0; i < listOfBooks.length; i++){
        var book = listOfBooks[i];
        var userObjects = [];
        for (var j = 0; book.rentedTo.length; j++){

        }
    }
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