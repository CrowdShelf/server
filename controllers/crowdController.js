/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of requests regarding crowds
 */

var Crowds = require('../models/crowd.js');

var userController = require('../controllers/userController.js'),
    stndResponse = require('../helpers/standardResponses.js');

var create = function(req, res){
    var crowd = req.body;
    delete crowd._id; // Can get a value from clients
    if (crowd.members.indexOf(crowd.owner) === -1 ) crowd.members.push(crowd.owner);
    if (!isValidCrowdObject(crowd)) return res.sendStatus(422);
    Crowds.findWithName(crowd.name, function(result){
        if (!result.length === 0) return res.status(409).send('Crowd name already in use.');
        Crowds.insertCrowd(crowd, function(insertData){
            res.json(insertData);
        });
    });
};

var update = function (req, res) {
    stndResponse.notImplemented(res);
};

var addMember = function(req, res){
    var username = req.params.username;
    var crowdId = req.params.crowdId;
    Crowds.addMember(crowdId, username, function(result){
        if(result === 404) return res.sendStatus(404);
        res.status(200).send('Member added.');
    });
};

var removeMember = function(req, res){
    var crowdId = req.params.crowdId,
        username = req.params.username;
    Crowds.removeMember(crowdId, username, function(result){
        if(result === 404) return res.sendStatus(404);
        res.status(200).send('Member removed.');
    });
};

var getAll = function(req, res){
    Crowds.getAll(function(result){
        var toReturn = [];
        result.forEach(function(doc, index){
            buildCrowdObject(doc, function(obj){
                toReturn.push(obj);
                if (index+1 === result.length ) res.json({crowds: toReturn}); // Done
            });
        });
    });
};

var getWithID = function(req, res){
    var crowdId = req.params.crowdId;
    Crowds.getCrowdWithId(crowdId, function(result){
        if (result === 404) return res.status(404).send('Crowd not found.');
        buildCrowdObject(result, function(obj){
            res.json(obj);
        });
    });
};

var getCrowds = function(req, res){
    var name = req.query.name ? req.query.name : null,
        member = req.query.member ? req.query.member : null;
    if (name && !member) return findWithName(req, res);
    if(name && member) return stndResponse.notImplemented(res);
};



var buildCrowdObject = function(crowdDoc, callback){
    var membersAsUserObjects = [];
    crowdDoc.members.forEach(function(memberName, index){
        userController.getUserByUsername(memberName, function(obj){ // Get that username as user object
            membersAsUserObjects.push(obj); // Push to list
            if(index + 1 === crowdDoc.members.length) { // If've checked all the membersAsUserObjects
                crowdDoc.members = membersAsUserObjects; // Set membersAsUserObjects list of object
                return callback(crowdDoc); // And return crowdDoc to callback
            }
        })
    });
};

var isValidCrowdObject = function(crowd){
    if (typeof crowd.owner === 'string'
        && typeof crowd.members === 'object'
        && typeof crowd.name === 'string'
        && Object.keys(crowd).length === 3) return true;
    return false;
};

module.exports = {
    create: create,
    update: update,
    addMember: addMember,
    removeMember: removeMember,
    getWithID: getWithID,
    getCrowds: getCrowds
};
