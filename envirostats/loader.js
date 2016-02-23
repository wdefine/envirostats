var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3://rivers.db.sqlite');

conn.query('CREATE  TABLE stats ("ident" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "date_int" INTEGER, "date_str" TEXT, "river" TEXT, "site_number" INTEGER, "lat" FLOAT, "long" FLOAT, "grid_number" INTEGER, "benthic_score" INTEGER, "flow_rate" FLOAT, "phosphates" FLOAT, "temperature" FLOAT, "ph" DOUBLE, "conductivity" FLOAT, "ammonium" FLOAT, "nitrates" FLOAT, "ecoli" FLOAT, "turbidity" FLOAT, "do_percent" FLOAT, "bod_percent" FLOAT, "soil" FLOAT, "plankton" FLOAT, "fish" FLOAT, "bod_column" FLOAT, "bod_hr" FLOAT)')
	.on('end', function(){
		console.log('Made table!');
	});