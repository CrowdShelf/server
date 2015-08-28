/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Model and DB-handling for crowd
 */

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';

var Crowds;
mongo.connect(url, function(err, db) {
    Crowds = db.collection('Crowds');
});

module.exports = {
    insertCrowd: function(crowd, callback){
        Crowds.insertOne(crowd, function(err, result){
            callback(result);
        });
    },

    addMemberToCrowd: function(crowdId, username, callback){
        Crowds.updateOne({_id: crowdId},{
            $push: {members: username }
        }, function(err, result){
           callback(result);
        });
    },

    removeCrowd: function(crowd, callback){
        Crowds.remove(crowd, function(err, result){
            callback(result);
        });
    }
};