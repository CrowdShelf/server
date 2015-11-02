/**
 * Created by esso on 17.09.15.
 */
var mongo = require('mongodb').MongoClient;
var url = process.env.MONGODB || 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var Joi = require('joi');

var schema = Joi.object().keys({
    _id: Joi.number().valid(-1).optional(),
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().optional()
});


var Users;
mongo.connect(url, function(err, db) {
    if(err) console.log(err);
    db.createCollection('Users');
    Users = db.collection('Users');
});

var insertUser = function(user, callback){
    delete user._id;
    if(isValid(user).error) return callback({validationError: isValid(user).error});
    Users.insert(user, function(err, result){
        if(err) return callback({error: err});
        if(result.ops) return callback(result.ops[0]);
        return callback(500);
    });
};

var removeUser = function(id, callback){
    Users.remove({_id: ObjectId(id)}, function(err, result){
        callback(result);
    });
};

var updateUser = function(id, newUser, callback){
    if(isValid(newUser).error) return callback({validationError: isValid(user).error});
    Users.updateOne({_id: id}, {$set: newUser}, function(err, result){
        if(err) return callback({error: err});
        if(!result) return callback(404);
        return callback(result);
    });
};


var findWithID  = function(id, callback){
    Users.findOne({_id: ObjectId(id)}, function(err, result){
        if(!err && !result) return callback(404); // NOt found
        if(!err) return callback(result); // result
        return callback({error: err}); // errors
    });
};

var findAll = function (callback) {
    Users.find({}).toArray(function (err, result) {
        if(!err) return callback(result);
    });
};

var findWithUsername = function (username, callback) {
    Users.findOne({username: username}, function (err, result) {
        if(err) return callback({error: err});
        if(!result) return callback(404);
        return callback(result);
    });
};

var isValid = function (user){
    return Joi.validate(user, schema);
};

/*
 * isAvailableUser
 * @description Checks if the username and e-mail in a user object is already in the db
 * @param User {}
 * @param callback(boolean)
 * @returns function
 */
var isAvailableUser = function (user, callback) {
    Users.find({$or: [{username: user.username}, {email: user.email}] }, function (err, result) {
        if(!err && result.length === 0) return callback(true);
        return callback(false);
    });
};

module.exports = {
    insertUser: insertUser,
    removeUser: removeUser,
    updateUser: updateUser,
    findWithID: findWithID,
    findWithUsername: findWithUsername,
    findAll: findAll,
    isAvailableUser: isAvailableUser
};