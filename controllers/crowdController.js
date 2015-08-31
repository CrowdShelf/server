/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of requests regarding crowds
 */

var Crowds = require('../models/crowd.js');

module.exports = {
    create: function(req, res){
        Crowds.insertCrowd(crowd, function(){
            res.sendStatus(201);
        });
    },

    addMember: function(req, res){
        var username = req.body.username;
        var crowd = req.body.crowdId;
        Crowds.addMemberToCrowd(crowd, username, function(result){

        });
    },

    getAll: function(req, res){

    },

    get: function(req, res){

    }
};