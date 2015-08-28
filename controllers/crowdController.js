/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 * Logic of requests regarding crowds
 */

var Crowds = require('../models/crowd.js');

module.exports = {
    create: function(req, res){
        Crowds.insertCrowd(crowd, function(){

        });
    },

    addMember: function(req, res){
        var username = req.body.username;
        var crowd = req.body.crowdId;

    },

    getAll: function(req, res){

    },

    get: function(req, res){

    }
};