/**
 * Created by esso on 24.10.15.
 */
var email = require('../helpers/emailSendingHelper'),
    templates = require('../helpers/emailTemplatesHelper');

/*
 * sendRegistrationEmail
 * @param recipentUser {User}
 * @param callback(result)
 */
var sendRegistrationEmail = function (recipentUser, callback) {
    templates.build('registerNewUser', {name: recipentUser.name}, function (result) {
        if(result.error) return callback({error: result.error});
        email.send(recipentUser.email, 'Welcome to CrowdShelf!', result, function (result) {
            if(result.error) return callback({error: result.error});
            callback({success: result});
        })
    });
};

/*
 * sendForgotPasswordEmail
 * @param recipentUser {User}
 * @param callback(result)
 */
var sendForgotPasswordEmail = function (recipentUser, resetKey, callback) {
    templates.build('resetPassword', {key: resetKey}, function (result) {
        if(result.error) return callback({error: result.error});
        email.send(recipentUser.email, 'Forgot password', result, function (result) {
            if(result.error) {
                console.log(result.error);
                return callback({error: result.error})
            }
            callback({success: result});
        })
    });
};

/*
 * sendInvitationEmail
 * @param inviter {User}
 * @param recipentUser {User}
 * @param callback(result)
 */
var sendInvitationEmail = function (inviter, recipentUser, callback) {
    templates.build('inviteUser', {inviter: inviter.name, invitee: recipentUser.name }, function (result) {
        if(result.error) return callback({error: result.error});
        email.send(recipentUser.email, 'A friend wants you to join CrowdShelf!', result, function (result) {
            if(result.error) return callback({error: result.error});
            callback({success: result});
        })
    });
};

module.exports = {
    sendRegistrationEmail: sendRegistrationEmail,
    sendForgotPasswordEmail: sendForgotPasswordEmail,
    sendInvitationEmail: sendInvitationEmail
};