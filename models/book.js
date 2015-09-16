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

var insert = function(book, callback){
    Books.insertOne(book, function(err, result){
        callback(result.ops[0]);
    });
};

var findWithISBN = function(isbn, callback){
    Books.find({isbn: isbn}).toArray(function(err, result){
        if (result.length === 0) return callback(404); // Not found
        callback(result);
    });
};

var findWithOwner = function(owner, callback){
    Books.find({owner: owner}).toArray(function(err, result){
        if (result.length === 0) return callback(404);
        callback(result);
    })
};


var findRentedBy = function(username, callback){
    Books.find({rentedTo: username}).toArray(function(err, result){
        if (!result) return callback(404);
        callback(result);
    });
};

var addRenter = function(isbn, owner, renter, callback) {
    // @TODO check if already a renter
    Books.updateOne({isbn: isbn, owner: owner}, {
        $push: {rentedTo: renter }
    },function(err, result){
        if(result.matchedCount === 0) return callback(404);
        findWithISBNAndOwner(isbn, owner, function(result){
            callback(result)
        });
    });
};

var removeRenter = function(isbn, owner, renter, callback){
    Books.updateOne({isbn: isbn, owner: owner}, {
        $pull: {rentedTo: renter }
    }, function(err, result) {
        if(result.matchedCount === 0) return callback(404);
        findWithISBNAndOwner(isbn, owner, function(result){
            callback(result)
        });
    });
};

var updateBook = function(newBook, callback){
    Books.update({isbn: newBook.isbn, owner: newBook.owner}, newBook,
        function(err, result){
            if(result) return callback(newBook);
            return callback(404);
    });
};

var findAll = function(callback){
    Books.find({}).toArray(function(err, result){
        callback(result);
    });
};

var findWithISBNAndOwner = function(isbn, owner, callback){
    var foundBooks = [];
    Books.findOne({isbn: isbn, owner: owner}, function(err, result){
        if (result === null) return callback(404);
        callback(result);
    });
};

module.exports = {
    insert: insert,
    findWithISBN: findWithISBN,
    findWithOwner: findWithOwner,
    findWithISBNAndOwner: findWithISBNAndOwner,
    findRentedBy: findRentedBy,
    addRenter: addRenter,
    removeRenter: removeRenter,
    updateBook: updateBook,
    findAll: findAll

};