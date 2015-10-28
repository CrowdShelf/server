/**
 * Created by esso on 24.10.15.
 */
var email = require('../helpers/emailSendingHelper'),
    templates = require('../helpers/emailTemplatesHelper');

var sendRegistrationEmail = function (recipent, callback) {
    // @TODO extract info from recipent object and generate HTML from a template
    // @TODO pass template HTML and other stuff to emai.send()
    templates.build('registerNewUser', {key: 'topkek'}, function (result) {
        if(result.error) return callback({error: result.error});
        email.send([recipentUser.email], 'Welcome to CrowdShelf!', result, function (result) {
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
var sendForgotPasswordEmail = function (recipentUser, callback) {
    // @TODO extract info from recipent object and generate HTML from a template
    // @TODO pass template HTML and other stuff to emai.send()
    templates.build('resetPassword', {key: 'topkek'}, function (result) {
        if(result.error) return callback({error: result.error});
        email.send([recipentUser.email], 'Forgot password', result, function (result) {
            if(result.error) return callback({error: result.error});
            callback({success: result});
        })
    });
};

var sendInvitationEmail = function (recipent, callback) {
    // @TODO extract info from recipent object and generate HTML from a template
    // @TODO pass template HTML and other stuff to emai.send()
    templates.build('inviteUser', {inviter: 'someUser', invitee: 'userToBeinvited'}, function (result) {
        if(result.error) return callback({error: result.error});
        email.send([recipentUser.email], 'A friend wants you to join CrowdShelf!', result, function (result) {
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