/**
 * Created by esso on 24.10.15.
 */
'use strict';
var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport');

var api_key = process.env.MAILGUN_KEY,
    domain = process.env.MAILGUN_DOMAIN;

var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

/*
 * @param recipents Array
 * @param subject String
 * @param content String
 * @param callback Function
 */
var sendEmail = function (recipents, subject, content, callback) {
    var mailOptions = {
        from: 'CrowdShelf <' + process.env.EMAIL_ADDRESS +  '>', // sender address
        to: recipents.join(), // list of receivers
        subject:  subject, // Subject line
        html: content.html, // html body
        text: content.text
    };
    mailgun.messages().send(mailOptions, function(error, body){
        if(error){
            return callback({error: error})
        }
        callback(body);
    });
};

module.exports = {
    send: sendEmail
};