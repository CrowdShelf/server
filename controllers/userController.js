/**
 * Created by esso on 02.09.15.
 */
var Users = require('../models/user.js');

var ObjectId = require('mongodb').ObjectID;

var stndResponse = require('../helpers/standardResponses.js');

var create = function(req, res){
    Users.insertUser(req.body, function(result){ // Not there, so it can be created
        if(result.error) return res.json(result.error); // Just some error
        if(result.validationError) return stndResponse.unprocessableEntity(res, {error: result.validationError});
        if(result === 500) return stndResponse.internalError(res);
        return res.json(result);
    });
};

var remove = function (req, res) {
    var id = req.params.userId;
    if(!ObjectId.isValid(id)) return stndResponse.unprocessableEntity(res, {error: 'Invalid objectId'});
    Users.removeUser(id, function (result) {
        if(result.ok === 1 && result.n === 1 ) return stndResponse.resourceDeleted(res);
        return stndResponse.notFound(res);
    });
};

var update = function (req, res) {
    Users.updateUser(req.params.userId, req.body, function (result) {
        if(result.validationError) return stndResponse.unprocessableEntity(res, {error: result.validationError});
        res.json(result);
    });
};

var getUser = function(req, res){
    var id = req.params.userId;
    if(!ObjectId.isValid(id)) return stndResponse.unprocessableEntity(res, {error: 'Invalid userID'}); 
    Users.findWithID(id, function(result){
        if(result.error) return res.json({error: result.error});
        if(result === 404) return stndResponse.notFound(res);
        return res.json(result);
    });
};

var getAllUsers = function (req, res) {
    if (req.query.username){
        return Users.findWithUsername(req.query.username, function (result) {
            if(result.error) return res.json(result.error);
            if(result === 404) return stndResponse.notFound(res);
            res.json(result);
        });
    }
    if(req.query) return stndResponse.notImplemented(res); // Query on anything else but username
    Users.findAll(function (result) { // No query
        res.json({users: result});
    });
};

var login = function (req, res) {
    Users.findWithUsername(req.body.username, function (result) {
        if(result.error) return res.json(result.error);
        if(result === 404) return stndResponse.notFound(res);
        res.json(result);
    });
};

var isValidUser = function (userID, callback) {
    Users.findWithID(userID, function (result) {
        if(!result) return callback(false); // Null, not found - not valid
        if(!result.error && result !== 404) return callback(true);
        return callback(false);
    });
};

module.exports = {
    create: create,
    update: update,
    remove: remove,
    getUser: getUser,
    getAllUsers: getAllUsers,
    login: login,
    isValidUser: isValidUser
};
