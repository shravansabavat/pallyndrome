var express = require('express');
var bodyParser = require('body-parser');
var pallyndromeRouter = require('./routers/pallyndromeRouter');
var healthCheckRouter = require('./routers/healthcheckRouter');
var cors = require('cors');
var methodOverride = require('method-override');

var PALLYNDROME_ENDPOINT = '/pallyndrome';
var HEALTHCHECK_ENDPOINT = '/healthcheck';

var PORT = 8081;
var corsOptions = {
    "origin": "*",
    "methods": [
        "GET","POST"
    ]
};

var app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.use(PALLYNDROME_ENDPOINT, pallyndromeRouter);
app.use(HEALTHCHECK_ENDPOINT, healthCheckRouter);




app.listen(PORT);
console.log('Magic happens on port ' + PORT);

exports = module.exports = app; 						// expose app