'use strict';
/*global require, process, console*/

var http = require('http'),
    express = require('express'),
    mailService = require('./api/mail/send'),
    compression = require('compression'),
    bodyParser = require('body-parser'), // Used to parse POST bodies
    //rootRegExp = /\/(?:#[\w]*)/i,
    server;

var app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', process.env.PORT || 3000); 

app.get('/', function (req, res) {
  res.sendfile('app/index.html');
});

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/work', express.static(__dirname + '/work'));
app.use('/vendor', express.static(__dirname + '/vendor'));


// Expose mail service
app.post('/api/mail/send', function (req, res) {

	function onComplete (message) {
		res.send(200, 'Message sent');
	}

	function onFailure (error) {
		res.send(500, {error: error});
	}

	try {
		mailService.sendMail({
	 		subject: req.body.subject,
	 		sender: req.body.email,
	 		message: req.body.message,
	 		name: req.body.name
	 	}, {
	 		onComplete: onComplete,
	 		onFailure: onFailure
	 	});
	} catch (e) {
		console.log(e.stack);
		res.send(400, {error: 'Bad parameters'});
	}
});

app.use(function (req,res) {
    res.sendfile('app/404.html'); // This code causes the 404 page to be loaded if it is there is no previous call to res.send()
});

// Init mail service
mailService.init();

server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// Do cleanup
server.on('close', function () {
	mailService.close();
});
