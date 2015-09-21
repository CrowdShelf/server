/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Model and DB-handling for crowd
 */

var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


var url = process.env.MONGODB || 'mongodb://localhost:27017/test';
var Crowds;
mongo.connect(url, function(err, db) {
    if(err) console.log(err);
    Crowds = db.collection('Crowds');
});

var schema = Joi.object().keys({
    name: Joi.string().required(),
    owner: Joi.objectId().required(),
    members: Joi.array().items(Joi.objectId()).required()
});


var insertCrowd = function(crowd, callback){
    if(!isValid(crowd)) return callback(422);
    Crowds.insertOne(crowd, function(err, result){
        callback(result.ops[0]);
    });
};

var updateCrowd = function(id, crowd, callback){
    Crowds.updateOne({_id: ObjectId(id)}, {$set: crowd}, function(err, result){
        if(!result) return callback(404);
        return callback(result);
    });
};

var removeCrowd = function(crowd, callback){
    Crowds.remove(crowd, function(err, result){
        callback(result);
    });
};


var addMember = function(crowdId, username, callback){
    Crowds.updateOne({_id: ObjectId(crowdId)},{
        $push: {members: username }
    }, function(err, result){
        if(!result) return callback(404);
        callback(result);
    });
};

var removeMember = function(crowdId, username, callback){
    Crowds.updateOne({_id: ObjectId(crowdId)}, {
        $pull: {members: username}
        }, function(err, result){
            if(!result) return callback(404);
            callback(result);
    })
};



var findAll = function(callback){
    Crowds.find({}).toArray(function (err, result) {
        callback(result);
    });
};

var findWithId = function(crowdId, callback){
    Crowds.findOne({_id : ObjectId(crowdId) },function(err, result){
        if(!result) return callback(404);
        return callback(result);
    });
};

var findWithName = function(crowdName, callback){
    Crowds.find({name: crowdName}).toArray(function(err, result){
        callback(result);
    });
};

var findWithOwner = function(owner, callback){
    Crowds.find({owner: owner}).toArray(function(err, result){
        callback(result);
    });
};


var findWithMembers = function(members, callback){
    Crowds.find({members: { $in: members }}).toArray(function(err, result){
        callback(result);
    });
};

var findWithNameAndOwner = function(crowdName, owner, callback){
    Crowds.find({name:crowdName, owner: owner}).toArray(function(err, result){
        callback(result);
    });
};


var findWithNameAndMembers = function(name, members, callback){
    Crowds.find({name: name, members: {$in: members}}).toArray(function (err, result) {
        callback(result);
    });
};


var findWithMembersAndOwner = function(members, owner, callback){
    Crowds.find({owner: owner, members: {$in: members}}).toArray(function (err, result) {
        callback(result);
    });
};

var findWitNamehMembersOwner = function(name, members, owner, callback){
    Crowds.find({name: name, owner: owner, members: {$in: members}})
        .toArray(function (err, result) {
            callback(result);
    });
};


var isValid = function (crowd){
    return Joi.validate(crowd, schema);
};


module.exports = {
    insertCrowd: insertCrowd,
    updateCrowd: updateCrowd,
    removeCrowd: removeCrowd,
    findWithId: findWithId,
    findWithName: findWithName,
    findWithMembers: findWithMembers,
    findWithOwner: findWithOwner,
    findWithNameAndOwner: findWithNameAndOwner,
    findWithNameAndMembers: findWithNameAndMembers,
    findWithMembersAndOwner: findWithMembersAndOwner,
    findWithNameMembersOwner: findWitNamehMembersOwner,
    findAll: findAll,
    addMember: addMember,
    removeMember: removeMember,
    isValid: isValid
};