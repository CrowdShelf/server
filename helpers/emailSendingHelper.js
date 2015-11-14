/**
 * Created by esso on 24.10.15.
 */
'use strict';
var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(smtpTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
}));

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
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return callback({error: error})
        }
        callback(info.response);
    });
};

module.exports = {
    send: sendEmail
};