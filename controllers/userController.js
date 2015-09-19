/**
 * Created by esso on 02.09.15.
 */
var Books = require('../models/book');
var Crowds = require('../models/crowd.js');
var Users = require('../models/user.js');

var create = function(req, res){

};

var getUser = function(req, res){
    var id = req.params.id;
    Users.find(id, function(result){
        res.json(result);
    });
};

var getUserByUsername = function(username, callback){
    var obj = {username: username}; // Add the username
    Books.findRentedBy(username, function(result){
        obj.booksRented = result !== 404 ? result:  [];
        Books.findWithOwner(username, function(result){
            obj.booksOwned = result !== 404 ? result : []; // The user's books
            Crowds.findCrowdWithMember(username, function(result){
                obj.crowds = [];
                result.forEach(function(crowd, index){
                    obj.crowds.push(crowd._id);
                    if (index +1 === result.length) return callback(obj);
                });
            })
        });
    });
};




module.exports = {
    getUser: getUser,
    getUserByUsername: getUserByUsername,
    create: create
};
