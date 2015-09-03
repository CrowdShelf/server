/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of requests regarding crowds
 */

var Crowds = require('../models/crowd.js');

module.exports = {
    create: function(req, res){
        var crowd = req.body;
        delete crowd._id; // Getting a -1 from clients
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
            res.sendStatus(200);
        });
    },

    removeMember: function(req, res){
        var crowdId = req.params.crowdId,
            username = req.body.username;
        Crowds.removeMember(crowdId, username, function(result){
            res.sendStatus(200);
        });
    },

    getAll: function(req, res){
        Crowds.getAll(function(result){
            res.send(result);
        });
    },

    get: function(req, res){
        var crowdId = req.params.crowdId;
        Crowds.getCrowd(crowdId, function(result){
           res.json(result);
        });
    }
};