/**
 * Created by esso on 02.09.15.
 */
var Books = require('../models/book');
var Crowds = require('../models/crowd.js');

function getUser(req, res){
    var username = req.params.username;
    getUserByUsername(username, function(result){
        res.json(result);
    });
}

function getUserByUsername(username, callback){
    var obj = {username: username}; // Add the username
    Books.findRentedBy(username, function(result){
        obj.booksRented = result !== 404 ? result:  [];
        Books.findWithOwner(username, function(result){
            obj.booksOwned = result !== 404 ? result : []; // The user's books
            Crowds.getCrowdWithMember(username, function(result){
                obj.crowds = [];
                result.forEach(function(crowd, index){
                    obj.crowds.push(crowd._id);
                    if (index +1 === result.length) return callback(obj);
                });
            })
        });
    });
}


module.exports = {
    getUser: getUser,
    getUserByUsername: getUserByUsername
};
