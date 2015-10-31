/**
 * Created by esso on 28.10.15.
 */
var bcrypt = require('bcrypt');

/*
 * hash
 * @description Takes a cleartext password and returns a hash of it
 * @param password
 * @param callback(hash)
 * @returns function(hash)
 */
var hash = function (password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if(!err) callback(hash);
        });
    });
};
/*
 * isValid
 * @description Checks if a password is valid or not
 * @param password String
 * @param hash String
 * @param callback(boolean)
 */
var isValid = function (password, hash, callback) {
    bcrypt.compare(password, hash, function(err, res) {
        if (err) throw err;
        return callback(res); // res is true or false
    });
};

module.exports = {
    hash: hash,
    isValid: isValid
};