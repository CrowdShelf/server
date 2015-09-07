/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of requests regarding crowds
 */

var Crowds = require('../models/crowd.js');

var userController = require('../controllers/userController.js');

module.exports = {
    create: function(req, res){
        var crowd = req.body;
        delete crowd._id; // Getting a -1 from clients
        if (!isValidCrowdObject(crowd)) return res.sendStatus(422);
        Crowds.insertCrowd(crowd, function(insertData){
            Crowds.getCrowd(insertData.electionId, function(result){
                res.json(result);
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
            res.json(result);
        });
    },

    get: function(req, res){
        var crowdId = req.params.crowdId;
        Crowds.getCrowd(crowdId, function(result){
            if (result === 404) return res.sendStatus(404);
            res.json(result);
        });
    }
};

function buildCrowdObject(doc, res){
    var members = [];
    for (var i = 0; i < doc.members.length; i++){
        userController.getUser()
    }
}

function isValidCrowdObject(crowd){
    if (typeof crowd.owner === 'string'
        && typeof crowd.members === 'object'
        && typeof crowd.name === 'string'
        && Object.keys(crowd).lengt === 3) return true;
    return false;
}