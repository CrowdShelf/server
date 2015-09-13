/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of book requests
 */

var Joi = require('joi');

var Books = require('../models/book');

module.exports = {
    createNew: function(req, res){
        var book = req.body;
        var oldBookId = book._id;
        delete book._id; // Getting a -1 from clients
        if(!isValidBookObject(book)) return res.sendStatus(422); // Unprocessable
        Books.findWithISBNAndOwner(book.isbn, book.owner, function(result){ // see if it's already there
            var oldResult = result;
            if (result !== 404){ // Something was found, so we'll update item.
                return Books.updateBook(book, function(result){
                    if(result === 404) return res.sendStatus(404);
                    result._id = oldResult._id;
                    res.json(result);
                })
            }
            return Books.insert(book, function(result){ // Not there, so it can be created
                res.json(result);
            });
        });
    },

    getWithISBN: function(req, res){
        var isbn = req.params.isbn;
        Books.findWithISBN(isbn, function(result){
            if (result === 404){
                return res.sendStatus(404);  // not found
            }
            res.json({books: result});
        });
    },

    getBooksOfOwner: function (req, res){
        var owner = req.params.owner;
        Books.findWithOwner(owner, function(result){
            if (result === 404) return res.sendStatus(404); 
            res.json({books: result});
        });
    },

    getWithISBNAndOwner: function(req, res){
        var isbn = req.params.isbn;
        var owner = req.params.owner;
        Books.findWithISBNAndOwner(isbn, owner, function(result){
            if (result === 404) return res.sendStatus(404);
            res.json(result);
        });
    },



    addRenter: function(req, res){
        Books.addRenter(req.params.isbn, req.params.owner, req.params.renter, function(result){
            res.json(result);
        });
    },

    removeRenter: function(req, res){
        Books.removeRenter(req.params.isbn, req.params.owner, req.params.renter, function(result){
            res.json(result);
        });
    },

    getAll: function(req, res){
        Books.findAll(function(result){
            res.json(result);
        });
    }
};

var schema = Joi.object().keys({
    owner: Joi.string().required(),
    isbn: Joi.string().required(),
    rentedTo: Joi.array().required(),
    numAvailableForRent: Joi.number().integer().min(0).required(),
    numberOfCopies: Joi.number().integer().min(0).required()
});

function isValidBookObject(book){
    return Joi.validate(book, schema);
}

function addUsersToBooks(listOfBooks){
    for (var i = 0; i < listOfBooks.length; i++){
        var book = listOfBooks[i];
        var userObjects = [];
        for (var j = 0; book.rentedTo.length; j++){

        }
    }
}