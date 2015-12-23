/**
 * Created by esso on 24.10.15.
 */
var email = require('../helpers/emailSendingHelper'),
    templates = require('../helpers/emailTemplatesHelper');

/*
 * sendRegistrationEmail
 * @param recipentUser {User}
 */
module.exports.sendRegistrationEmail = function (recipentUser) {
    templates.build('registerNewUser', {name: recipentUser.name}, function (result) {
        if(result.error) return console.log(result);
        email.send(recipentUser.email, 'Welcome to CrowdShelf!', result);
    });
};

/*
 * sendForgotPasswordEmail
 * @param recipentUser {User}
 * @param callback(result)
 */
module.exports.sendForgotPasswordEmail = function (recipentUser, resetKey, callback) {
    templates.build('resetPassword', {key: resetKey}, function (result) {
        if(result.error) return callback({error: result.error});
        email.send(recipentUser.email, 'Forgot password', result);
        callback(null);
    });
};

/*
 * sendInvitationEmail
 * @param inviter {User}
 * @param recipentUser {User}
 * @param callback(result)
 */
module.exports.sendInvitationEmail = function (inviter, recipentUser, callback) {
    templates.build('inviteUser', {inviter: inviter.name, invitee: recipentUser.name }, function (result) {
        if (result.error) return callback({error: result.error});
        email.send(recipentUser.email, 'A friend wants you to join CrowdShelf!', result);
        callback(null);
    });
};
