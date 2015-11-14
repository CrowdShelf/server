/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of requests regarding crowds
 */

var Crowds = require('../models/crowd.js');

var userController = require('../controllers/userController.js'),
    stndResponse = require('../helpers/standardResponses.js');

var ObjectId = require('mongodb').ObjectID;


var create = function(req, res){
    var crowd = req.body;
    delete crowd._id; // Can get a value from clients, but it's not used as Mongo gives the ID
    if(Crowds.isValid(crowd).error) return stndResponse.unprocessableEntity(res, {error: Crowds.isValid(crowd).error});
    if (crowd.members.indexOf(crowd.owner) === -1 ) crowd.members.push(crowd.owner);
    userController.isValidListOfUsers(crowd.members, function (isValid) {
        if(!isValid) return stndResponse.unprocessableEntity(res, {error: 'One or more of the member IDs are invalid'});
        Crowds.findWithName(crowd.name, function(result){
            if (!result.length === 0) return res.status(409).send('Crowd name already in use.');
            Crowds.insertCrowd(crowd, function(insertData){
                res.json(insertData);
            });
        });
    });

};

var update = function (req, res) {
    var crowd = req.body;
    if(!ObjectId.isValid(req.params.crowdId)) return stndResponse.unprocessableEntity(res);
    if (crowd.members.indexOf(crowd.owner) === -1 ) crowd.members.push(crowd.owner);
    userController.isValidListOfUsers(crowd.members, function (isValid) {
        if(!isValid) return stndResponse.unprocessableEntity(res, {error: 'One or more of the member IDs are invalid'});
        Crowds.findWithName(crowd.name, function(result){
            if (!result.length === 0) return res.status(409).send('Crowd name already in use.');
            Crowds.updateCrowd(req.params.crowdId, crowd, function(result){
                if(result === 404) return stndResponse.notFound(res);
                res.json(result);
            });
        });
    });
};



var remove = function(req, res){
    if(!ObjectId.isValid(req.params.crowdId)) return stndResponse.unprocessableEntity(res);
    Crowds.removeCrowd(req.params.crowdId, function(result){
        if(result.result.n === 1) return stndResponse.resourceDeleted(res);
        return stndResponse.notFound(res);
    });
};

var getWithName = function(req, res){
    Crowds.findWithName(req.query.name, function(result){
        res.json(result);
    });
};

var addMember = function(req, res){
    var userId = req.params.userId;
    var crowdId = req.params.crowdId;
    userController.isValidUser(userId, function (result) {
        if(!result) return res.json({error: 'Invalid userID.'});
        Crowds.addMember(crowdId, userId, function(result){
            if(result === 404) return res.sendStatus(404);
            res.status(200).send('Member added.');
        });
    });

};

var removeMember = function(req, res){
    var crowdId = req.params.crowdId,
        userId = req.params.userId;
    Crowds.removeMember(crowdId, userId, function(result){
        if(result === 404) return res.sendStatus(404);
        res.status(200).send('Member removed.');
    });
};

var getAll = function(req, res){
    Crowds.findAll(function(result){
        res.json({crowds: result});
    });
};

var getWithID = function(req, res){
    var crowdId = req.params.crowdId;
    Crowds.findWithId(crowdId, function(result){
        if (result === 404) return res.status(404).send('Crowd not found.');
        res.json(result);
    });
};

var getCrowds = function(req, res){
    var name = req.query.name ? req.query.name : null,
        member = req.query.member ? req.query.member : null,
        owner = req.query.owner ? req.query.owner : null;
    if(name && !member && !owner) return getWithName(req, res);
    if(!name && member && !owner) return getWithMember(req, res);
    if(!name && !member && owner) return getWithOwner(req, res);
    if(name && member && !owner) return getWithNameAndMembers(req, res);
    if(!name && member && owner ) return getWithMembersAndOwner(req, res);
    if (name && !member && owner) return getWithNameAndOwner(req, res);
    if (name && member && owner) return getWithNameMembersOwner(req, res);
    return getAll(req, res);
};

var getWithOwner = function (req, res) {
    Crowds.findWithOwner(req.query.owner, function(result){
        if(result === 404) return stndResponse.notFound(res);
        return res.json(result);
    });
};

var getWithMember = function(req, res){
    Crowds.findWithMembers([req.query.member], function(result){
        if(result.error) return res.json(result); // {error: err}
        res.json(formatResultForClient(result));
    });
};

var getWithNameAndOwner = function (req, res) {
    Crowds.findWithNameAndOwner(req.query.name, req.query.owner, function(result){
        if(result === 404) return stndResponse.notFound(res);
        return res.json(result);
    });
};

var getWithNameAndMembers = function (req, res) {
    Crowds.findWithNameAndMembers(req.query.name, req.query.members, function(result){
        res.json(result);
    });
};


var getWithNameMembersOwner = function (req, res) {
    Crowds.findWithNameMembersOwner(req.query.name, req.query.members, req.query.owner, function(result){
        return res.json(result);
    });
};

var formatResultForClient = function (result) {
    return {crowds: result}
};


module.exports = {
    create: create,
    update: update,
    remove: remove,
    addMember: addMember,
    removeMember: removeMember,
    getWithID: getWithID,
    getCrowds: getCrowds
};
