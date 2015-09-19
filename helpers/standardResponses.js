/**
 * Created by esso on 19.09.15.
 */

/*
 * notImplemented
 * @param {res}
 * @description Informs requestor that feature is not implemented
 */
var notImplemented = function(res){
    res.send('Not implemented.');
};

module.exports = {
    notImplemented: notImplemented
}; 