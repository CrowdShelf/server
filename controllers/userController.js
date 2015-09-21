/**
 * Created by esso on 02.09.15.
 */
var Users = require('../models/user.js');

var ObjectId = require('mongodb').ObjectID;

var stndResponse = require('../helpers/standardResponses.js');

var create = function(req, res){
    Users.insertUser(req.body, function (result) {
        if(result === 422) return stndResponse.unprocessableEntity(res);
        res.json(result);
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
    Users.find(id, function(result){
        res.json(result);
    });
};





module.exports = {
    create: create,
    update: update,
    remove: remove,
    getUser: getUser
};
