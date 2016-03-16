var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3://rivers.db.sqlite');

conn.query('CREATE TABLE stats ("ident" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "date" INTEGER, "river" TEXT, "site_number" INTEGER, "lat" FLOAT, "lon" FLOAT, "grid_number" INTEGER, "benthic_score" INTEGER, "flow_rate" FLOAT, "phosphates" FLOAT, "temperature" FLOAT, "ph" DOUBLE, "conductivity" FLOAT, "ammonium" FLOAT, "nitrates" FLOAT, "ecoli" FLOAT, "turbidity" FLOAT, "do_percent" FLOAT, "bod_percent" FLOAT, "soil" FLOAT, "plankton" FLOAT, "fish" FLOAT, "bod_column" FLOAT, "bod_hr" FLOAT, "v_constricta" INTEGER, "s_undulatus" INTEGER, "p_collina" INTEGER)')
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
conn.query('CREATE TABLE columns ("namey" TEXT, "niceNames" TEXT)') //first is defines, second (niceNames) is for app.get so that they come out nciely when printed on the webpage :) -Clara
	.on('end', function(){
		console.log('Made table!');
	});
conn.query('INSERT INTO columns VALUES ($1, $2)', ["lat","Latitude"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["lon","Longitude"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["flow_rate", "Flow Rate"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["phosphates", "Phosphates (mol/L)"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["temperature", "Temperature (deg C)"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["ph", "pH"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["conductivity", "Conductivity (uS/cm)"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["ammonium", "Ammonium (mg/L)"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["nitrates", "Nitrates (mg/L)"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["turbidity", "Turbidity (NTU)"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["do_percent", "DO (%)"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["bod_percent", "BOD (%)"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["bod_column", "BOD% - DO%"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["bod_hr", "BOD/hr"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["v_constricta", "V. Constricta"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["s_undulatus", "S. Undulatus"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["p_collina", "P. Collina"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["ecoli", "E. Coli"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["benthic_score", "Benthic Score"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["soil", "Soil"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["plankton", "Plankton"]);
conn.query('INSERT INTO columns VALUES ($1, $2)', ["fish", "Fish"]);

conn.query('INSERT INTO rivers VALUES ($1)', ["RIVER"]);

