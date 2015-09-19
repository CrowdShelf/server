/**
 * Created by esso on 17.09.15.
 */
var mongo = require('mongodb').MongoClient;
var url = process.env.MONGODB || 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;

var Users;
mongo.connect(url, function(err, db) {
    if(err) console.log(err);
    Users = db.collection('Users');
});

var insert = function(user, callback){
    //@TODO
};

var find  = function(id, callback){
    Users.findOne({_id: ObjectId(id)}, function(err, result){
        if(!err) callback(result);
        else callback(err);
    });
};

var remove = function(user, callback){
    //@TODO
};

var update = function(id, newUser, callback){
    //@TODO
};

module.exports = {
    insert: insert,
    remove: remove,
    update: update
};