/**
 * Created by esso on 28.10.15.
 */

var hat = require('hat'),
    mongo = require('mongodb').MongoClient;


var url = process.env.MONGODB || 'mongodb://localhost:27017/test';
var Tokens;
mongo.connect(url, function(err, db) {
    if(err) console.log(err);
    db.createCollection('Tokens');
    Tokens = db.collection('Tokens');
});

var removeToken  = function (token) {
    Tokens.remove({token: token}, {w:0});
};

/*
 * generate
 * @description Generates a new token with Hat, adds it to the db and gives
 * @returns A new token object
 */
var generate = function () {
    var tokenObj = {
        token: hat(),
        expires: new Date()
    };
    Tokens.insertOne(tokenObj, {w: 0});
    return tokenObj;
};

var isValid = function (token, callback) {
    Tokens.findOne({token: token}, function(err, result){
        if(!err && !result) return callback(false); // NOt found
        if(!err) {
            if (token.expires < new Date()) {
                return callback(false);
            } //expired
            return callback(true);
        } // result
        return callback(false); // errors
    });
};

module.exports = {
    generate: generate,
    isValid: isValid
};