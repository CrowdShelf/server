/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Model and database handling for books
 */
'use strict';

var mongo = require('mongodb').MongoClient;
var url = process.env.MONGODB || 'mongodb://localhost:27017/test';

var Books;
mongo.connect(url, function(err, db) {
    Books = db.collection('Books');
});

module.exports = {
    insert: function(book, callback){
        Books.insertOne(book, function(err, result){
            callback(result.ops[0]);
        });
    },


    findWithISBN: function(isbn, callback){
        Books.find({isbn: isbn}).toArray(function(err, result){
            if (result.length === 0) return callback(404); // Not found
            callback(result);
        });
    },

    findWithOwner: function(owner, callback){
        Books.find({owner: owner}).toArray(function(err, result){
            if (result.length === 0) return callback(404);
            callback(result);
        })
    },

    findRentedBy: function(username, callback){
        Books.find({rentedTo: username}).toArray(function(err, result){
            if (!result) return callback(404);
            callback(result);
        });
    },

    findWithISBNAndOwner: function(isbn, owner, callback){
        var foundBooks = [];
        Books.findOne({isbn: isbn, owner: owner}, function(err, result){
            if (result === null) return callback(404);
            callback(result);
        });
    },

    addRenter: function(isbn, owner, renter, callback) {
        Books.updateOne({isbn: isbn, owner: owner}, {
            $push: {rentedTo: renter }
        }, function(err, result){
            callback(result);
        });
    },

    removeRenter: function(isbn, owner, renter, callback){
        Books.updateOne({isbn: isbn, owner: owner}, {
            $pull: {rentedTo: renter }
        }, function(err, result){
            callback(result);
        });
    },

    updateBook: function(newBook, callback){
        Books.update({isbn: newBook.isbn, owner: newBook.owner},{
            $set: {
                rentedTo: newBook.rentedTo,
                numAvailableForRent: newBook.numAvailableForRent,
                numberOfCopies: newBook.numberOfCopies
            }
        }, function(err, result){
            if(result) return callback();
            return callback(404);
        });
    }

};