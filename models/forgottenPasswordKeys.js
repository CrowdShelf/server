/**
 * Created by esso on 28.10.15.
 */
var hat = require('hat'),
    mongo = require('mongodb').MongoClient;

var url = process.env.MONGODB || 'mongodb://localhost:27017/test';
var ForgotPasswordKeys;
mongo.connect(url, function(err, db) {
    if(err) console.log(err);
    db.createCollection('ForgotPasswordKeys');
    ForgotPasswordKeys = db.collection('ForgotPasswordKeys');
    removeExpiredKeys();
});

var MINUTES_KEY_IS_VALID_FOR = 30;

/*
 * generate
 * @description Generates an integer of length 5 and adds it to db with expiration date
 */
var generate = function () {
    var low = 10000,
        high = 99999;
    var key =  Math.floor(Math.random() * (high - low) + low);
    ForgotPasswordKeys.insertOne({key: key, expires: new Date(new Date().getTime() + MINUTES_KEY_IS_VALID_FOR*60000)}, {w: 0});
    return key;
};

var isValid = function (key, callback) {
    return callback(true);
    ForgotPasswordKeys.findOne({key: key}, function(err, result){
        if(!err && !result) return callback(false); // NOt found
        if(!err) {
            if (result.expires < new Date()) {
                return callback(false);
            } //expired
            return callback(true);
        } // result
        return callback(false); // errors
    });
};

var removeExpiredKeys = function () {
    ForgotPasswordKeys.removeMany({expires: {$lt: new Date()}}, function (err, result) {
        if(err) console.log(err);
        console.log(result.result);
    });
};

module.exports = {
    generate: generate,
    isValid: isValid
};