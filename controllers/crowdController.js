/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of requests regarding crowds
 */

var Crowds = require('../models/crowd.js');

var userController = require('../controllers/userController.js');

module.exports = {
    create: function(req, res){
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
    },

    addMember: function(req, res){
        var username = req.body.username;
        var crowdId = req.params.crowdId;
        Crowds.addMember(crowdId, username, function(result){
            if(result === 404) return res.sendStatus(404);
            res.sendStatus(200);
        });
    },

    removeMember: function(req, res){
        var crowdId = req.params.crowdId,
            username = req.body.username;
        Crowds.removeMember(crowdId, username, function(result){
            if(result === 404) return res.sendStatus(404);
            res.sendStatus(200);
        });
    },

    getAll: function(req, res){
        Crowds.getAll(function(result){
            var toReturn = [];
            for (var i = 0; i < result.length; i++){
                buildCrowdObject(result[i], function(obj){
                   toReturn.push(obj);
                    if(i === result.length) return res.json({crowds: toReturn});
                });
            }
        });
    },

    get: function(req, res){
        var crowdId = req.params.crowdId;
        Crowds.getCrowd(crowdId, function(result){
            if (result === 404) return res.sendStatus(404);
            buildCrowdObject(result, function(obj){
                res.json(obj);
            });
        });
    }
};

function buildCrowdObject(doc, callback){
    var members = [];
    for (var i = 0; i < doc.members.length; i++){
        userController.getUserByUsername(doc.members[i], function(obj){ // Get that username as user object
            members.push(obj); // Push to list
            if(i === doc.members.length) { // If've checked all the members
                doc.members = members; // Set members list of object
                return callback(doc); // And return doc to callback
            }
        })
    }
}

function isValidCrowdObject(crowd){
    if (typeof crowd.owner === 'string'
        && typeof crowd.members === 'object'
        && typeof crowd.name === 'string'
        && Object.keys(crowd).length === 3) return true;
    return false;
}
