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
	socket.on('getVisits', function(){
		var data = [];
		conn.query('SELECT river, date FROM visits')
		.on('data', function(row){
			data.push(row);
		})
		.on('end', function(){
			socket.emit('returnVisits', data)
		});
	});
	socket.on('newdata', function(identifier, column, value){
		conn.query('UPDATE stats SET ($2)=($3) WHERE ident=($1)', [identifier, column, value])
		.on("end", function() {
			sockets.emit('updatedata', identifier, column, value);
		});
	});
	socket.on('getdata', function(date, river, since){ //needs river, date, 
		//date and river |river | date | all rivers since a certain date | all
		if(date == 0 && river == 0 && since == 0){ //return all
			var a = conn.query('SELECT * FROM stats');
			socket.emit('returnData', getSpecData(a));
		}
		/*else if(date != 0 && river == 0 && since == 0){ //return from date
			var b = conn.query('SELECT * FROM stats WHERE date = ($1)', [date]);
			socket.emit('returnData', getSpecData(b));
		}*/
		else if(date == 0 && river != 0 && since == 0){ //return from river
			var c = conn.query('SELECT * FROM stats WHERE river = ($1)', [river]);
			socket.emit('returnData', getSpecData(c));
		}
		else if(date != 0 && river != 0 && since == 0){ //return from both river and date
			var d = conn.query('SELECT * FROM stats WHERE river = ($1) AND date = ($2)', [river, date]);
			socket.emit('returnData', getSpecData(d));
		}
		else if(date != 0 && river == 0 && since != 0){ //return everything since a certain date
        	var e = conn.query('SELECT * FROM stats WHERE date >= ($1)',[date]);
			socket.emit('returnData', getSpecData(e));
		}
	});

	socket.on('addColumn', function(name){ //adds comlumn with new data type, takes in column name 
		conn.query('ALTER TABLE stats ADD ($1) float', [name]);
		//
		//edit mustahce file
		//
		conn.query('INSERT INTO columns (name) VALUES ($1)',[name]);
		sockets.emit('newColumn', name);
	});

	socket.on('newentries', function(date, river){
		var x =0;
		conn.query('SELECT river, date FROM visits')
			.on('data', function(row){
				if(row.river == river && row.date == date){
					x=1;
				}
			})
			.on('end', function(){
				if(x==0){
					for(var i=0; i<10; i++){	
						conn.query('INSERT INTO stats (date, river) VALUES($1,$2)',[date, river]);
					}
					conn.query('INSERT INTO rivers (river) VALUES ($1)', [river]);
					conn.query('INSERT INTO dates (date) VALUES ($1)', [date]);
					conn.query('INSERT INTO visits (river, date) VALUES ($1, $2)', [river,date]);
					var special = conn.query('SELECT * FROM stats WHERE river =($1) AND date = ($2)', [river, data]);
					socket.emit('returnData', getSpecData(special));
					sockets.emit('updateRiverDate', river, date);
				}	
			});

	});
});


app.get('/', function(request, response){
	response.render('index.html');
	
});
app.get('/submit', function(request, response){
	var recent=0;
	conn.query('SELECT date FROM stats')
	.on('data', function(row){
		if(row.date >recent){
			recent = row.date;
		}
	})
	.on('end', function(){
		conn.query('SELECT * FROM stats WHERE date >= ($1)',[recent])
		.on('data', function(row){
			var date = getRealDate(row.date);
			var river = row.river;
		})		
		.on('end', function(){
			var river = [];
			conn.query('SELECT * FROM rivers')
			.on('data', function(row){
				rivers.push(row);
			})
			.on('end', function(){
				column = [];
				conn.query('SELECT * FROM columns')
				.on('data', function(row){
					column.push(row);
				})
				.on('end',function(){
					response.render('submit.html', {rivers: river, metariver:river, metadate:date});
					socket.emit('allColumns', column);
					socket.emit('returnData');//where river=metariver and date=metadate
				});
			});
		});
	});
});
app.get('/export', function(request, response){
	//get river date and column here
	response.render('export.html', rivers:river, dates:date,);
	socket.emit('allColumns', column);
});

function getSpecData(db){
	var data = [];
	db.on('data', function (row){
		row.date = getRealDate(row.date);
		data.push(row);
	});
	db.on('end', function(){
		return data;
	});
}
function getRealDate(number){
	var d = new Date(number);
	var date = d.toJSON().substring(0,10);
	return date; 
}

server.listen(8080)