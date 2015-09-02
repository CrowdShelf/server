/**
 * Created by esso on 02.09.15.
 */
var Books = require('../models/book');
var Crowds = require('../models/crowd.js');

module.exports = {
    getUser: function(req, res){
        var username = req.params.username;
        var obj = {username: username}; // Add the username
        Books.findWithOwner(username, function(result){
            obj.books = result ? result : null; // The user's books
            Crowds.getAll(function(result){
                obj.crowds = [];
                for (var i = 0; i < result.length; i++){
                    if (username in result[i]){
                        obj.crowds.push(result[i]);
                    }
                }
                return res.json(obj);  // send it
            })
        });
    }
};