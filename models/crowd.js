/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Model and DB-handling for crowd
 */

var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var url = process.env.MONGODB || 'mongodb://localhost:27017/test';
var Crowds;
mongo.connect(url, function(err, db) {
    Crowds = db.collection('Crowds');
});

var insertCrowd = function(crowd, callback){
    Crowds.insertOne(crowd, function(err, result){
        callback(result.ops[0]);
    });
};

var findWithName = function(crowdName, callback){
    Crowds.find({name: crowdName}).toArray(function(err, result){
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

var removeCrowd = function(crowd, callback){
    Crowds.remove(crowd, function(err, result){
        callback(result);
    });
};

var getAll = function(callback){
    Crowds.find({}).toArray(function (err, result) {
        callback(result);
    });
};

var getCrowdWithId = function(crowdId, callback){
    Crowds.findOne({_id : new ObjectId(crowdId) },function(err, result){
        if(!result) return callback(404);
        return callback(result);
    });
};

var getCrowdWithMember = function(memberName, callback){
    Crowds.find({members: { $in: [memberName] }}).toArray(function(err, result){
        callback(result);
    });
};

module.exports = {
    insertCrowd: insertCrowd,
    removeCrowd: removeCrowd,
    getCrowdWithMember: getCrowdWithMember,
    getCrowdWithId: getCrowdWithId,
    findWithName: findWithName,
    getAll: getAll,
    addMember: addMember,
    removeMember: removeMember
};