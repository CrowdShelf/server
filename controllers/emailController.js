/**
 * Created by esso on 24.10.15.
 */
var email = require('../helpers/emailHelper');

var sendRegistrationEmail = function (recipent, callback) {
    // @TODO extract info from recipent object and generate HTML from a template
    // @TODO pass template HTML and other stuff to emai.send()
};

var sendForgotPasswordEmail = function (recipent, callback) {
    // @TODO extract info from recipent object and generate HTML from a template
    // @TODO pass template HTML and other stuff to emai.send()
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