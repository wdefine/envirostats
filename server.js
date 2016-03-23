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
	socket.roomy ="Room";
	socket.on('signin', function(passwd){
		socket.join("theRoom");
		if(passwd == "i<3stats"){
		socket.roomy ="theRoom";
	}
	});
	socket.on('submitStarter', function(){
		var recent=0;
		conn.query('SELECT date FROM stats')
		.on('data', function(row){
			if(row.date >recent){
				recent = row.date;
			}
		})
		.on('end', function(){
			var date;
			var river;
			conn.query('SELECT date,river FROM stats WHERE date >= ($1)',[recent])
			.on('data', function(row){
				date = row.date;
				river = row.river;
			})		
			.on('end', function(){
				column = [];
				conn.query('SELECT * FROM columns')
				.on('data', function(row){
					column.push(row.namey);
				})
				.on('end',function(){
					socket.emit('allColumns', column);
					var g = conn.query('SELECT * FROM stats WHERE river = ($1) AND date = ($2)', [river, date]);
					var data = getSpecData(g,function(data) { socket.emit('returnData', data); });
				});
			});
		});
	});
	socket.on('exportStarter', function(){
		//get river date and column here
		var headerList = [];
		var riverList = [];
		var z = conn.query('SELECT * FROM columns');
		z.on('data', function(row){
			headerList.push({type:row.niceNames, classnames:row.namey});
		});
		z.on('end', function(){
			var q = conn.query('SELECT * FROM rivers');
			q.on('data', function(row){
				riverList.push({river:row.river});
			});
			q.on('end', function(){
				var dates =[];
				conn.query('SELECT * FROM dates')
				.on('data',function(row){
					row.date = getRealDate(row.date);
					dates.push({date:row.date});
				})
				.on('end', function(){
					socket.emit('allColumns', headerList);
				});
			});	 
		});
	});
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
		console.log(identifier+" "+column+" "+value);
		conn.query('UPDATE stats SET ($1) = ($2) WHERE ident = ($3)', [column, value, identifier])
		.on('end', function() {
			var sockets = io.sockets.clients("theRoom");
			sockets.emit('updatedata', identifier, column, value);
		})
		.on('data', function(){
			console.log("i is an idiot");
		})
		.on('error', function(){
			console.log("someone is an idiot");
		});
	});
	socket.on('getdata', function(date, river, since){ //needs river, date, 
		//date and river |river | date | all rivers since a certain date | all
		if(date == 0 && river == 0 && since == 0){ //return all
			var a = conn.query('SELECT * FROM stats');
			getSpecData(a,function(data) { socket.emit('returnData', data); });
		}
		/*else if(date != 0 && river == 0 && since == 0){ //return from date
			var b = conn.query('SELECT * FROM stats WHERE date = ($1)', [date]);
			socket.emit('returnData', getSpecData(b));
		}*/
		else if(date == 0 && river != 0 && since == 0){ //return from river
			var c = conn.query('SELECT * FROM stats WHERE river = ($1)', [river]);
			getSpecData(c,function(data) { socket.emit('returnData', data); });
		}
		else if(date != 0 && river != 0 && since == 0){ //return from both river and date
			//console.log("making sure I'm here" + date+ " "+river);
			var d = conn.query('SELECT * FROM stats WHERE river = ($1) AND date = ($2)', [river, date]);
			getSpecData(d,function(data) { socket.emit('returnData', data); });
		}
		else if(date != 0 && river == 0 && since != 0){ //return everything since a certain date
        	var e = conn.query('SELECT * FROM stats WHERE date >= ($1)',[date]);
			getSpecData(e,function(data) { socket.emit('returnData', data); });
		}
	});

	socket.on('addColumn', function(namey, niceName){ //adds comlumn with new data type, takes in column name 
		conn.query('ALTER TABLE stats ADD ($1) float', [name]);
		//
		//edit mustahce file
		//
		conn.query('INSERT INTO columns (namey, niceNames) VALUES ($1,$2)',[namey, niceName]);
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
		if(row.date > recent){
			recent = row.date;
		}
	})
	.on('end', function(){
		var date;
		var river;
		conn.query('SELECT * FROM stats WHERE date >= ($1)',[recent])
		.on('data', function(row){
			if(river != row.river && date != getRealDate(row.date)){ //need to check if its already used because there are ten entries for each river+date combination
			date = getRealDate(row.date);
			river = row.river; 
			}
		})		
		.on('end', function(){
			var rivers = [];
			conn.query('SELECT * FROM rivers')
			.on('data', function(row){
				rivers.push({rivernum: row.river});
			})
			.on('end', function(){
				column = [];
				conn.query('SELECT * FROM columns')
				.on('data', function(row){
					column.push({niceNames: row.niceNames});
				})
				.on('end',function(){
					response.render('data.html', {columns: column, rivers: rivers, metariver: river, metadate: date});
				});
			});
		});
	});
});

app.get('/export', function(request, response){
	//get river date and column here
	var headerList = [];
	var riverList = [];
	var z = conn.query('SELECT * FROM columns');
	z.on('data', function(row){
		//console.log(row.niceNames);
		headerList.push({niceNames:row.niceNames, namey:row.namey});
	});
	z.on('end', function(){
		var q = conn.query('SELECT * FROM rivers');
		q.on('data', function(row){
			//console.log(row.river);
			riverList.push({river:row.river});
		});
		q.on('end', function(){
			var dates =[];
			conn.query('SELECT * FROM dates')
			.on('data',function(row){
				dates.push({date:row.date, nicedate:getRealDate(row.date)});
			})
			.on('end', function(){
				response.render('export.html', {columns: headerList, rivers: riverList, dates:dates});
			});
		});	 
	});
});

function getSpecData(db,callback){
	var data = [];
	db.on('data', function (row){
		row.date = getRealDate(row.date);
		data.push(row);
	})
	db.on('end', function(){
		callback(data);
	});
}
function getRealDate(number){
	var d = new Date(number);
	var date = d.toJSON().substring(0,10);
	console.log(date);
	return date; 
}

server.listen(8080)