/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of book requests
 */

var Books = require('../models/book');

module.exports = {
    createNew: function(req, res){
        var book = req.body; //@TODO check if isbn with owner is already in db, then just update/replace that entry
        Books.insert(book, function(result){
            res.sendStatus(201); // 201 Created
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