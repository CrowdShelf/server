/**
 * Created by esso on 02.09.15.
 */

var ObjectId = require('mongodb').ObjectID,
    _ = require('underscore');

var Users = require('../models/user.js'),
    stndResponse = require('../helpers/standardResponses.js'),
    passwordController = require('./passwordController'),
    emailController = require('./emailController'),
    tokens = require('../models/tokens'),
    forgottenPasswordKeys = require('../models/forgottenPasswordKeys');

var create = function(req, res){
    var user = req.body;
    if(!user.password) return stndResponse.unprocessableEntity(res, {error: 'Missing password.'});
    Users.isAvailableUser(user, function (isAvailable) {
        if(!isAvailable) return res.status(409).json({error: 'There is already a user with that username or e-mail.'});
        passwordController.hash(user.password, function (hash) {
            user.password = hash;
            Users.insertUser(user, function(result){
                if(result.error) return res.json(result.error); // Just some error
                if(result.validationError) return stndResponse.unprocessableEntity(res, {error: result.validationError});
                if(result === 500) return stndResponse.internalError(res);
                delete result.password; // remove hash from object
                emailController.sendRegistrationEmail(result, function(result) {return; });
                return res.json(result);
            });
        });
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
    var id = ObjectId(req.params.userId);
    Users.updateUser(id, req.body, function (result) {
        if(result.validationError) return stndResponse.unprocessableEntity(res, {error: result.validationError});
        res.json(result);
    });
};

var getUser = function(req, res){
    var id = req.params.userId;
    if(!ObjectId.isValid(id)) return stndResponse.unprocessableEntity(res, {error: 'Invalid userID'}); 
    Users.findWithID(ObjectId(id), function(result){
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
            res.json({users: cleanUserObjects([result])  } );
        });
    }
    Users.findAll(function (result) { // No query
        res.json({users: cleanUserObjects(result) });
    });
};

var login = function (req, res) {
    Users.findWithUsername(req.body.username, function (result) {
        if(result.error) return res.json({error:  result.error});
        if(result === 404) return stndResponse.notFound(res);
        var user = result;
        passwordController.isValid(req.body.password, result.password, function (result) {
            if(!result){ // Wrong password
                return res.status(401).send('Wrong password.');
            }
            delete user.password; // Remove password from return object
            user.token = tokens.generate().token; // generate token
            return res.json(user);
        })
    });
};

var isValidUser = function (userID, callback) {
    if (!ObjectId.isValid(userID)) return callback(false);
    Users.findWithID(ObjectId(userID), function (result) {
        if(!result) return callback(false); // Null, not found - not valid
        if(!result.error && result !== 404) return callback(true);
        return callback(false);
    });
};

var isValidListOfUsers = function (userIdList, callback) {
    var listOfValidObjectIds = [];
    _.each(userIdList, function (item) {
        if(!ObjectId.isValid(item)) return callback(false);
        listOfValidObjectIds.push(ObjectId(item));
    });
    Users.findMultipleWithIds(listOfValidObjectIds, function (result) {
        if(result.error) return callback(false);
        if(result.length === userIdList.length) return callback(true);
        callback(false);
    });
};

/*
 * forgotPassword
 * @description Generate a password key and e-mail it to specified user
 */
var forgotPassword = function (req, res) {
    if(!req.body.username) return stndResponse.badRequest(res); // Need username to get a key
    var key = forgottenPasswordKeys.generate(); // Needs a key
    Users.findWithUsername(req.body.username, function (result) { // Get user and send e-mail
        if(result == 404) return stndResponse.notFound(res);
        if(result.error) return res.json({error: result.error});
        emailController.sendForgotPasswordEmail(result, key, function (result) {
            res.status(200).send('A key has been sent to your inbox. Not there? Contact us.');
        });
    });
};

var resetPassword = function(req, res){
    if (!req.body.username || !req.body.key || !req.body.password) {
        return stndResponse.badRequest(res); // Need key, username and new password
    }
    forgottenPasswordKeys.isValid(req.body.key, function (result) {
        if(!result) return res.status(401).send('Invalid key.');  // Invalid
        // Valid, hash new password and replace it
        Users.findWithUsername(req.body.username, function (result) {
            if(!result || result == 404) return stndResponse.notFound(res);
            if(result.error) return res.json({error: result.error});
            var user = result;
            delete user._id; // Don't want this to be changed.
            passwordController.hash(req.body.password, function (hash) {
                user.password = hash;
                Users.updateUser(result._id, user, function (result) {
                    if(result.error) {
                        return stndResponse.internalError(res);
                    }
                    if(result.validationError) return stndResponse.unprocessableEntity(res, result);
                    if(result === 404) return stndResponse.notFound(res); //
                    return res.status(200).send('New password is set.');
                });
            });
        });
    });
};

var inviteUser = function (req, res) {
    var inviter = req.body.inviter;
    var userToInvite = req.body.invitee;
    if(!inviter.name || !userToInvite.name || !userToInvite.email) {
        return stndResponse.unprocessableEntity(res, {error: 'Missing name and/or e-mail on either the person you want to invite, or yourself.'});
    }
    emailController.sendInvitationEmail(inviter, userToInvite, function (result) {
        if (result.success) return res.status(200).send('Invite sent.');
        return stndResponse.internalError(res);
    })
};

var cleanUserObjects = function (arrayOfUsers) {
    var cleanArrayOfUsers = [];
    _.each(arrayOfUsers, function(user, index){
        delete user.password;
        cleanArrayOfUsers.push(user);
    });
    return cleanArrayOfUsers;
};

module.exports = {
    create: create,
    update: update,
    remove: remove,
    getUser: getUser,
    getAllUsers: getAllUsers,
    isValidUser: isValidUser,
    login: login,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    inviteUser: inviteUser,
    isValidListOfUsers: isValidListOfUsers
};
