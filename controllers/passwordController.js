/**
 * Created by esso on 28.10.15.
 */
var bcrypt = require('bcrypt');

/*
 * hash
 * @description Takes a cleartext password and returns a hash of it
 * @param password
 * @returns hash
 */
var hash = function (password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
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