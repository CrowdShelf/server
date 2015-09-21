/**
 * Created by esso on 17.09.15.
 */
var mongo = require('mongodb').MongoClient;
var url = process.env.MONGODB || 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var Joi = require('joi');

var schema = Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required()
});


var Users;
mongo.connect(url, function(err, db) {
    if(err) console.log(err);
    Users = db.collection('Users');
});

var insertUser = function(user, callback){
    Users.insertOne(user, function (err, result) {
        callback(result.ops[0]);
    });
};

var removeUser = function(id, callback){
    Users.remove({_id: ObjectId(id)}, function(err, result){
        callback(result);
    });
};

var updateUser = function(id, newUser, callback){
    Users.updateOne({_id: ObjectId(id)}, {$set: newUser}, function(err, result){
        if(!result) return callback(404);
        return callback(result);
    });
};

var findWithID  = function(id, callback){
    Users.findOne({_id: ObjectId(id)}, function(err, result){
        if(!err) callback(result);
        else callback(err);
    });
};


module.exports = {
    insertUser: insertUser,
    removeUser: removeUser,
    updateUser: updateUser,
    findWithID: findWithID
};