/**
 * Created by esso on 24.10.15.
 */
'use strict';
var mail = require('mailgun-send');

mail.config({
    key: process.env.MAILGUN_KEY,
    sender: 'CrowdShelf <' + process.env.EMAIL_ADDRESS +  '>'
});

/*
 * @param recipents Array
 * @param subject String
 * @param content String
 * @param callback Function
 */
var sendEmail = function (recipient, subject, content) {
    mail.send({
        recipient: recipient, // list of receivers
        subject:  subject, // Subject line
        body: content.html // html body
    });
};

module.exports = {
    send: sendEmail
};