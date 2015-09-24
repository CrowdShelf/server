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
    email: Joi.string().email().required()
});


var Users;
mongo.connect(url, function(err, db) {
    if(err) console.log(err);
    Users = db.collection('Users');
});

var insertUser = function(user, callback){
    if(!isValid(user)) return callback(422);
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
    if(!isValid(user)) return callback(422);
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

var isValid = function (user){
    var res = Joi.validate(user, schema);
    if (!res.error) return true;
    return false;
};


module.exports = {
    insertUser: insertUser,
    removeUser: removeUser,
    updateUser: updateUser,
    findWithID: findWithID
};