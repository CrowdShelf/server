/**
 * Created by esso on 04.11.15.
 * Middleware: Controls if request needs token, and if that token is valid.
 * Probably should be replaced with Passport.
 */
var stndResponse = require('../helpers/standardResponses'),
    Tokens = require('../models/tokens'),
    _ = require('underscore');

var LEGAL_PATHS = ['/login', '/invite', '/forgotpassword', '/resetpassword' ];

var validate = function (req, res, next) {
    // If request is not of method OPTIONS or is a request that's legal, check the token
    if (req.method !== 'OPTIONS' && ( req.body.token || req.query.token) ) {
        var token = (req.body.token ? req.body.token : req.query.token); // Either body-token or query token
        return Tokens.isValid(token, function (tokenIsValid) {
            if (tokenIsValid) {
                req.body = cleanObjForToken(req.body);
                req.query = cleanObjForToken(req.query);
                return next(); // Go on
            }
            return stndResponse.invalidToken(res); // Invalid token
        });
    }
    else if (req.method === 'OPTIONS' || isLegalPath(req.path)|| isRegistrationRequest(req) ) // Registration and Regular methods
        return next();
    return stndResponse.invalidToken(res); // Invalid token
};

var isLegalPath =  function(path){
    if(path === '/api' || path === '/api/') return true;
    return _.each(LEGAL_PATHS, function (item, index) {
        if('/api' + item  === path || '/api' + item  + '/' ===  path) return true;
        if (index +1 === LEGAL_PATHS.length) return false;
    });
};

var cleanObjForToken = function (obj) {
    newObj = obj;
    delete newObj.token;
    return newObj;
};

var isRegistrationRequest = function (req) {
    return req.method === 'POST' &&  (req.path === '/api/users' || req.path === '/api/users/')
};

module.exports = {
    validate: validate
};