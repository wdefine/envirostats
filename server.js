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
	// These functions can be socket or post/get 
	socket.on('newdata', function(identifier, column, value){
		conn.query('UPDATE stats SET ($2)=($3) WHERE ident=($1)', [identifier, column, value])
		.on("end", function() {
			sockets.emit('updatedata', identifier, column, value);
		});
	});
	socket.on('newentries', function(date, river, number)){
		for(var i=0; i<number; i++){	
			conn.query('INSERT INTO stats (date, river, site_number) VALUES($1,$2,$3,$4)',[date, river, i])
			});
		}
		sockets.emit('updateentries', date, river);
	socket.on('getdata', function(name){
	});
});


app.get('/', function(request, response){
	var recent=0;
	conn.query('SELECT date FROM stats')
	.on('data', function(row){
		if(row.date >recent){
			recent = row.date;
		}
	})
	.on('end', function(){
		var data = [];
		conn.query('SELECT * FROM stats WHERE date >= ($1)'[recent])
		.on('data', function(row){
			data.push(row);
		})		
		.on('end', function(){
			var rivers = [];
			conn.query('SELECT * FROM rivers')
			.on('data', function(row){
				rivers.push(row);
			})
			.on('end', function(){
				var dates = [];
				conn.query('SELECT * FROM dates')
				.on('data', function(row){
					dates.push(row);
				})
				.on('end', function(){
					response.render('index.html', {data: data, rivers: rivers, dates: dates});
				});
			});
		});
	});
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
