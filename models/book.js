/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Model and database handling for books
 */
'use strict';

var mongo = require('mongodb').MongoClient;
var url = process.env.MONGODB || 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


var Books;
mongo.connect(url, function(err, db) {
    if(err) console.log(err);
    Books = db.collection('Books');
});

var schema = Joi.object().keys({
    _id: [Joi.objectId(), Joi.number().valid(-1)],
    owner: Joi.objectId(),
    isbn: Joi.string(),
    googleId: Joi.string(),
    rentedTo: [Joi.objectId(), null],
    availableForRent: Joi.boolean()
});

schema = schema.requiredKeys('owner', 'isbn', 'rentedTo', 'availableForRent');

var insertBook = function(book, callback){
    if(isValid(book).error) return callback({validationError: isValid(book).error});
    delete book._id;
    Books.insert(book, function(err, result){
        if(err) return callback({error: err});
        if(result.ops) return callback(result.ops[0]);
        return callback(500);
    });
};

var updateBook = function(id, newBook, callback){
    if(isValid(newBook).error) return callback({validationError: isValid(newBook).error});
    delete newBook._id; // If it's there, it shouldn't be set by anyting
    Books.update({_id: ObjectId(id)}, {$set: newBook},
        function(err, result){
            if(result) return callback(newBook);
            return callback(404);
        });
};

var removeBook = function (id, callback) {
    Books.remove({_id: ObjectId(id)}, function(err, result){
        callback(result);
    });
};

var findWithISBN = function(isbn, callback){
    Books.find({isbn: isbn}).toArray(function(err, result){
        if (result.length === 0) return callback(404); // Not found
        callback(result);
    });
};

var findWithID = function(id, callback){
    if(!ObjectId.isValid(id)) return callback(422);
    Books.findOne({_id: ObjectId(id)}, function(err, result){
        if(!result) return callback(404);
        return callback(result);
    });
};

var findWithOwner = function(owner, callback){
    Books.find({owner: owner}).toArray(function(err, result){
        if (result.length === 0) return callback(404);
        callback(result);
    })
};


var findRentedTo = function(rentee, callback){
    Books.find({rentedTo: rentee}).toArray(function(err, result){
        if (!result) return callback(404);
        callback(result);
    });
};

var findAll = function(callback){
    Books.find({}).toArray(function(err, result){
        return callback(result);
    });
};

var findWithISBNAndOwner = function(isbn, owner, callback){
    Books.findOne({isbn: isbn, owner: owner}, function(err, result){
        if (result === null) return callback(404);
        return callback(result);
    });
};

var findWithOwnerAndRentedTo = function (owner, rentee, callback) {
    Books.find({owner: owner, rentedTo: rentee}).toArray(function (err, result) {
        if(!err) return callback(result);
        return callback({error: err})
    })
};

var findWithISBNRentedTo = function (isbn, rentee, callback) {
    if(!ObjectId.isValid(rentee)) return callback(422);
    findMultiple({isbn: isbn, rentedTo: rentee}, function (err, result) {
        if(!err) return callback(result);
        return callback({error: err})
    });
};

var findWithISBNOwnedByRentedTo = function (isbn, owner, rentee, callback) {
    findMultiple({isbn: isbn, owner: owner, rentedTo: rentee}, function (err, result) {
        if(!err) return callback(result);
        return callback({error: err})
    })
};


var findMultiple = function (findObj, callback) {
    Books.find(findObj).toArray(callback);
};

var addRenter = function(bookId, renterId, callback) {
    // @TODO check if already a renter
    Books.update({_id: ObjectId(bookId)}, {
        $set: {rentedTo: renterId }
    },function(err, result){
        if(!result) return callback({error: err});
        findWithID(bookId, function(result){
            if (result === 404) return callback({error: 'Invalid bookId'});
            callback(result)
        });
    });
};

var removeRenter = function(bookId, renterId, callback){
    // @TODO check if renterId is the renter of the bookId
    Books.update({_id: ObjectId(bookId)}, {
        $set: {rentedTo: null }
    }, function(err, result) {
        if(!result) return callback({error: err});
        findWithID(bookId, function(result){
            if (result === 404) return callback({error: 'Invalid bookId'});
            callback(result)
        });
    });
};

var isValid = function (book){
    return Joi.validate(book, schema);
};

var booleanIsValid = function (book) {
    var res = Joi.validate(book, schema);
    if (!res.error) return true;
    return false;
};

module.exports = {
    insert: insertBook,
    remove: removeBook,
    updateBook: updateBook,
    addRenter: addRenter,
    removeRenter: removeRenter,
    findWithISBN: findWithISBN,
    findWithOwner: findWithOwner,
    findRentedTo: findRentedTo,
    findWithISBNAndOwner: findWithISBNAndOwner,
    findWithISBNOwnedByRentedTo: findWithISBNOwnedByRentedTo,
    findWithISBNRentedTo: findWithISBNRentedTo,
    findWithOwnerAndRentedTo: findWithOwnerAndRentedTo,
    findAll: findAll,
    findWithID: findWithID,
    isValid: booleanIsValid
};