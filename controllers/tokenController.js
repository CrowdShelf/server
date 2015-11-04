/**
 * Created by esso on 04.11.15.
 * Middleware: Controls if request needs token, and if that token is valid.
 * Probably should be replaced with Passport.
 */
var stndResponse = require('../helpers/standardResponses'),
    Tokens = require('../models/tokens');

var LEGAL_PATHS = ['/api', '/api/', '/api/login', '/api/login/', '/api/invite', '/api/invite/'];

var validate = function (req, res, next) {
    // If request is not of method OPTIONS or is a request that's legal, check the token
    if ((req.method === 'OPTIONS' || isLegalPath(req.path) // Regular methods
        || (req.method === 'POST' &&  (req.path === '/api/users' || req.path === '/api/users/') ) ))  // Registration
        return next();
    else if (req.method !== 'OPTIONS' && ( req.body.token || req.query.token) ) {
        var token = (req.body.token ? req.body.token : req.query.token); // Either body-token or query token
        return Tokens.isValid(token, function (tokenIsValid) {
            if (tokenIsValid) {
                return next(); // Go on
            }
            return stndResponse.invalidToken(res); // Invalid token
        });
    }
    return stndResponse.invalidToken(res); // Invalid token
};

var isLegalPath =  function(path){
    return LEGAL_PATHS.indexOf(path) > -1;
};

module.exports = {
    validate: validate
};