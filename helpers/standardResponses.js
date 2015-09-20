/**
 * Created by Stein-Otto Svorstøl on 19.09.15.
 * Standard responses to be used in controllers to respond to requests.
 * Only takes the res-objects as paramteter, and returns general message and/or status code
 */

/*
 * notFound
 * @param {res}
 * @description Resource not found
 */
var notFound = function(res){
    return res.status(404).send('Resource not found.');
};

/*
 * unprocessableEntity
 * @param {res}
 * @description Something wrong with entity given
 */
var unprocessableEntity = function (res) {
    return res.status(422).send('Unprocessable entity.')
};

/*
 * notImplemented
 * @param {res}
 * @description Feature not implemented
 */
var notImplemented = function(res){
    return res.status(200).send('Not implemented.');
};

/*
 * resourceDeleted
 * @param {res}
 * @description Resource successfully deleted
 */
var resourceDeleted = function(res){
   return res.status(200).send('Resource deleted.');
};

module.exports = {
    notImplemented: notImplemented,
    notFound: notFound,
    unprocessableEntity: unprocessableEntity,
    resourceDeleted: resourceDeleted
};