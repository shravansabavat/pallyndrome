var fs = require('fs');
var _ = require('lodash');
var filepath = '../database/messages.json';
var path = require('path');
var errors = require('../routers/validation/parameterValidationErrors');

function getMessages() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, filepath), 'utf8'));
}

function deleteMessage(messageData, callback) {
    var deleted = false;
    var fileData = getMessages();

    if (typeof messageData !== 'undefined') {
        var fileData = _.without(fileData, _.findWhere(fileData, messageData));
        if (typeof fileData === 'undefined' || fileData.length === 0) {
            fileData = [];
        }

        writeFileData(fileData, function (err) {
            deleted = true;
            callback(err, deleted);
        });
    } else {
        callback(errors.INVALID_STRING);
    }
}

function isValidPallyndrome(data) {
    var actualString = data.input.replace(/[^A-Z0-9]/ig, "").toLowerCase();
    var reverseString = actualString.split('').reverse().join('');
    return reverseString.toLowerCase() === actualString.toLowerCase();
}

function saveMessage(data) {
    var fileData = getMessages();
    fileData = _.without(fileData, _.findWhere(fileData, data));

    var isValid = isValidPallyndrome(data);

    if (isValid) {
        data.palindrome = "Yes";
    } else {
        data.palindrome = "No";
    }

    fileData.push(data);

    writeFileData(fileData);
}

function writeFileData(fileData, callback) {
    fs.writeFile(path.join(__dirname, filepath), JSON.stringify(fileData), function (err){
        if (err)  {
            throw err;
        }
        if (typeof callback !== 'undefined') {
            callback(err);
        }
        console.log('File written successful');
    });
}

module.exports = {
    getMessages: getMessages,
    deleteMessage: deleteMessage,
    saveMessage: saveMessage
}