var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3://rivers.db.sqlite');

conn.query('CREATE  TABLE stats ("ident" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "date" INTEGER, "river" TEXT, 
	"site_number" INTEGER, "lat" FLOAT, "lon" FLOAT, "grid_number" INTEGER, "benthic_score" INTEGER, "flow_rate" FLOAT, 
	"phosphates" FLOAT, "temperature" FLOAT, "ph" DOUBLE, "conductivity" FLOAT, "ammonium" FLOAT, "nitrates" FLOAT, 
	"ecoli" FLOAT, "turbidity" FLOAT, "do_percent" FLOAT, "bod_percent" FLOAT, "soil" FLOAT, "plankton" FLOAT, "fish" FLOAT, 
	"bod_column" FLOAT, "bod_hr" FLOAT, "v_constricta" INTEGER, "s_undulatus" INTEGER, "p_collina" INTEGER)')
	.on('end', function(){
		console.log('Made table!');
	});
conn.query('CREATE TABLE rivers ("river" TEXT)')
	.on('end', function(){
		console.log('Made table!');
	});
conn.query('CREATE TABLE dates ("date" INTEGER)')
	.on('end', function(){
		console.log('Made table!');
	});
conn.query('CREATE TABLE visits ("river" TEXT, "date" INTEGER)')
	.on('end', function(){
		console.log('Made table!');
	});
conn.query('CREATE TABLE columns ("namey" TEXT')
	.on('end', function(){
		console.log('Made table!');
	});
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["lat"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["lon"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["flow_rate"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["phosphates"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["temperature"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["ph"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["conductivity"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["ammonium"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["nitrates"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["turbidity"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["do_percent"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["bod_percent"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["bod_column"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["v_constricta"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["s_undulatus"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["p_collina"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["bod_hr"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["ecoli"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["benthic_score"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["soil"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["plankton"]);
conn.query('INSERT INTO columns (namey) VALUES ($1)', ["fish"]);