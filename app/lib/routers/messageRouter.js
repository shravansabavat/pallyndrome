var express = require('express');
var _ = require('lodash');
var bodyParser = require('body-parser');
var messageService = require('../services/messageService');
var validParam = require('../routers/validation/parameterValidation');
var errors = require('../routers/validation/parameterValidationErrors');
var HttpStatus = require('http-status-codes');

var router = express.Router();
router.use(bodyParser.json());

router.get('/list', function (req, res) {
    var messages = messageService.getMessages();
    res.status(HttpStatus.OK).send(messages).end();
});

router.get('/:input', function (req, res) {
    var input = req.params.input;
    var message = messageService.getMessage(input);
    res.status(HttpStatus.OK).send(message).end();
});

router.delete('/:input', function (req, res) {
    var input = req.params.input;
    messageService.deleteMessage(input, function(err) {
        if (err && err === errors.INVALID_STRING) {
            console.log(err);
            res.status(HttpStatus.BAD_REQUEST).end(err);
        }else if (err) {
            console.log('Error deleting message', err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
        } else {
            console.log('Delete successful with message ' + input);
            res.status(HttpStatus.OK).send(true).end();
        }
    });
});

router.post('/', function (req, res) {
    try {
        var str = validParam.validateMessage(req);
        messageService.saveMessage(str);

        var result = {
            'messageSaved': true
        };

        res.status(HttpStatus.OK).send(result).end();
    } catch (e) {
        if (e === errors.INVALID_STRING) {
            res.status(HttpStatus.BAD_REQUEST).send(e).end();
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e).end();
        }
    }
});

module.exports = router;
