/**
 * Created by esso on 24.10.15.
 */
var email = require('../helpers/emailSendingHelper'),
    templates = require('../helpers/emailTemplatesHelper');

var sendRegistrationEmail = function (recipent, callback) {
    // @TODO extract info from recipent object and generate HTML from a template
    // @TODO pass template HTML and other stuff to emai.send()

};

var sendForgotPasswordEmail = function (recipent, callback) {
    // @TODO extract info from recipent object and generate HTML from a template
    // @TODO pass template HTML and other stuff to emai.send()
    templates.build('resetPassword', {key: 'topkek'}, function (result) {
        if(result.error) return callback({error: result.error});
        email.send([recipent], 'Forgot password', result, function (result) {
            if(result.error) return callback({error: result.error});
            callback({success: result});
        })
    });
};

var sendInvitationEmail = function (recipent, callback) {
    // @TODO extract info from recipent object and generate HTML from a template
    // @TODO pass template HTML and other stuff to emai.send()
};


module.exports = {
    sendRegistrationEmail: sendRegistrationEmail,
    sendForgotPasswordEmail: sendForgotPasswordEmail,
    sendInvitationEmail: sendInvitationEmail
};