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
    rentedTo: [Joi.objectId(), null],
    availableForRent: Joi.boolean()
});

schema = schema.requiredKeys('owner', 'isbn', 'rentedTo', 'availableForRent');

var insertBook = function(book, callback){
    if(!isValid(book)) return callback(422);
    delete book._id;
    Books.insert(book, function(err, result){
        if(err) return callback({error: err});
        if(result.ops) return callback(result.ops[0]);
        return callback(500);
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


var findRentedBy = function(username, callback){
    Books.find({rentedTo: username}).toArray(function(err, result){
        if (!result) return callback(404);
        callback(result);
    });
};

var addRenter = function(id, renter, callback) {
    // @TODO check if already a renter
    Books.updateOne({_id: ObjectId(id)}, {
        $push: {rentedTo: renter }
    },function(err, result){
        if(result.matchedCount === 0) return callback(404);
        findWithID(id, function(result){
            callback(result)
        });
    });
};

var removeRenter = function(id, renter, callback){
    Books.updateOne({_id: ObjectId(id)}, {
        $pull: {rentedTo: renter }
    }, function(err, result) {
        if(result.matchedCount === 0) return callback(404);
        findWithID(id, function(result){
            callback(result)
        });
    });
};

var updateBook = function(id, newBook, callback){
    delete newBook._id; // If it's there, it shouldn't be set by anyting
    Books.update({_id: ObjectId(id)}, {$set: newBook},
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
    Books.findOne({isbn: isbn, owner: owner}, function(err, result){
        if (result === null) return callback(404);
        callback(result);
    });
};

var isValid = function (book){
    var res = Joi.validate(book, schema);
    if (!res.error) return true;
    return false;
};

module.exports = {
    insert: insertBook,
    remove: removeBook,
    updateBook: updateBook,
    findWithISBN: findWithISBN,
    findWithOwner: findWithOwner,
    findWithISBNAndOwner: findWithISBNAndOwner,
    findRentedBy: findRentedBy,
    addRenter: addRenter,
    removeRenter: removeRenter,
    findAll: findAll,
    findWithID: findWithID,
    isValid: isValid
};