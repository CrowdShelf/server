/**
 * Created by Stein-Otto Svorstøl on 26.08.15.
 */
module.exports = {
    createNew: function(req, res){
        res.send('thanks');
    },

    getItem: function(req, res){
        res.send('here are item');
    },

    getItems: function(req, res){
        res.send('here are items');
    }
};