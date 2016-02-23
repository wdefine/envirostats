var http = require('http'); // this is new
var express = require('express');
var app = express();
var server = http.createServer(app); // this is new
// add socket .io
var io = require('socket.io').listen(server);
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://rivers.db.sqlite');

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run.html files through Hogan
app.set('views', __dirname +'/templates'); // tell Express where to find templates

app.use(express.static(__dirname + '/public'));


io.on('connection', function(socket) {
	socket.on('join', function(room, name, callback){
		
	});
	socket.on('disconnect', function(){
	});

	// These functions can be socket or post/get 
	socket.on('newdata', function(identifier, column, value){
		conn.query('UPDATE stats SET ($2)=($3) WHERE ident=($1)', [identifier, column, value])
		.on("end", function() {
		});
	});
	socket.on('getdata', function(name){
	});
});


app.get('/', function(request, response){//keep this old code
	response.render('index.html', {rooms: roomlist});
});

app.get('/:room', function(request, response){
	var room = request.params.room;
	response.render('room.html', {roomName: room});
});

server.listen(8080)


function getTime(){//this is a string
	var currentTime = new Date()
	var hours = currentTime.getHours().toString();
	var minutes = currentTime.getMinutes().toString();
	var seconds = currentTime.getSeconds().toString();
	if (minutes < 10)
		minutes = "0" + minutes;
	if (seconds < 10)
		seconds = "0" + seconds;
	return hours + ":" + minutes + ":" + seconds;
}