var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var app = express();

mongoose.connect(config.database, function (err) {
	if (err) {
		console.log(err);
	}
	else {
		console.log('Connected to the database.');
	}
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
	req.header('Access-Control-Allow-Credentials', true);
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "*");
	next();
});

app.use(express.static(__dirname + '/public'));

var nodeApi = require('./routes/nodeAPI')(app, express);
app.use('/nodeAPI', nodeApi);

var api = require('./routes/api')(app, express);
app.use('/api', api);


app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/app/views/index.html');
});

app.listen(config.port, function (err) {
	if (err) {
		console.log(err);
	}
	else {
		console.log('Listening on port 3000');
	}
});