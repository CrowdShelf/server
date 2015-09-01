/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of book requests
 */

var Books = require('../models/book');

module.exports = {
    createNew: function(req, res){
        var book = req.body;
        if(!validBookObject(book)) return res.sendStatus(422); // Unprocessable
        Books.findWithISBNAndOwner(book.isbn, book.owner, function(result){ // see if it's already there
            if (result) return res.sendStatus(409); // Already there, so conflict
            Books.insert(book, function(result){ // Not there, so it can be created
                return res.sendStatus(201); // 201 Created
            });
        });
    },

    getWithISBN: function(req, res){
        var isbn = req.params.isbn;
        Books.findWithISBN(isbn, function(result){
            if (result === 404){
                return res.sendStatus(404);  // not found
            }
            res.json(result);
        });
    },

    getBooksOfOwner: function (req, res){
        var owner = req.params.owner;
        Books.findWithOwner(owner, function(result){
            if (result === 404) return res.sendStatus(404); 
            res.json(result);
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
    }
};

function validBookObject(book){
    if (isbn in book && owner in book && rentedTo in book
        && availableForRent in book && numberOfCopies in book ) return true;
    return false;
}