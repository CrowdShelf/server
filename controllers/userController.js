/**
 * Created by esso on 02.09.15.
 */
var Books = require('../models/book');
var Crowds = require('../models/crowd.js');
var Users = require('../models/user.js');

var create = function(req, res){
    Users.insertUser(req.body, function (result) {
        res.json(result);
    });
};

var remove = function (req, res) {
    Users.removeUser(req.params.userId, function (result) {
        res.json(result);
    });
};

var update = function (req, res) {
    Users.updateUser(req.params.userId, req.body, function (result) {
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
