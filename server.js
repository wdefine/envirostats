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

	socket.on('getdata', function(date, river, since){ //needs river, date, 
		var data = [];
		//date and river |river | date | all rivers since a certain date | all
		if(date == null && river == null && since == null){ //return all
			var a = conn.query('SELECT * FROM stats');
			socket.emit('returnData', getSpecData(a));
		}
		else if(date != null && river == null && since == null){ //return from date
			var b = conn.query('SELECT * FROM stats WHERE date = $1', [date]);
			socket.emit('returnData', getSpecData(b));
		}
		else if(date == null && river != null && since == null){ //return from river
			var c = conn.query('SELECT * FROM stats WHERE river = $1', [river]);
			socket.emit('returnData', getSpecData(c));
		}
		else if(date != null && river != null && since == null){ //return from both river and date
			var d = conn.query('SELECT * FROM stats WHERE river = $1 AND date = $2', [river, date]);
			socket.emit('returnData', getSpecData(d));
		}
		else if(date != null && river == null && since != null){ //return everything since a certain date
        	var e = conn.query('SELECT * FROM stats WHERE date >= ($1)'[recent]);
			socket.emit('returnData', getSpecData(e));
		}
		
		function getSpecData(db){
			db.on('data', function (row){
				data.push(row);
			});
			db.on('end', function{
				return data;
			});
		}
	socket.on('newentries', function(date, river, number)){
		var x =0;
		conn.query('SELECT river, date FROM visits')
			.on('data', function(row){
				if(row.river == river && row.date == date){
					x=1;
				}
			})
			.on('end', function(){
				if(x==0){
					for(var i=0; i<number; i++){	
						conn.query('INSERT INTO stats (date, river, site_number) VALUES($1,$2,$3,$4)',[date, river, i]);
					}
					conn.query('INSERT INTO rivers (river) VALUES ($1)', [river]);
					conn.query('INSERT INTO dates (date) VALUES ($1)', [date]);
					conn.query('INSERT INTO visits (river, date) VALUES ($1, $2)', [river,date]);
					sockets.emit('updateentries', river, date);
				}	
			});

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