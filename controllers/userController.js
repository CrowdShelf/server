/**
 * Created by esso on 02.09.15.
 */
var Users = require('../models/user.js');

var ObjectId = require('mongodb').ObjectID;

var stndResponse = require('../helpers/standardResponses.js');

var create = function(req, res){
    Users.insertUser(req.body, function(result){ // Not there, so it can be created
        if(result.error) return res.json(result.error); // Just some error
        if(result === 422) return stndResponse.unprocessableEntity(res);
        if(result === 500) return stndResponse.internalError(res);
        return res.json(result);
    });
};

var remove = function (req, res) {
    var id = req.params.userId;
    if(!ObjectId.isValid(id)) return stndResponse.unprocessableEntity(res);
    Users.removeUser(id, function (result) {
        res.json(result);
    });
};

var update = function (req, res) {
    Users.updateUser(req.params.userId, req.body, function (result) {
        if(result === 422) return stndResponse.unprocessableEntity(res);
        res.json(result);
    });
};

var getUser = function(req, res){
    var id = req.params.userId;
    Users.findWithID(id, function(result){
        res.json(result);
    });
};

var getAllUsers = function (req, res) {
    Users.findAll(function (result) {
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





module.exports = {
    create: create,
    update: update,
    remove: remove,
    getUser: getUser,
    getAllUsers: getAllUsers,
    login: login
};
