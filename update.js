var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3://rivers.db.sqlite');

conn.query('UPDATE stats SET ($1) = ($2) WHERE ident = ($3)', ["temperature", 30, 2]);
conn.query('UPDATE stats SET ($1) = ($2) WHERE ident = ($3)', ["flow_rate", 5, 2]);
conn.query('UPDATE stats SET ($1) = ($2) WHERE ident = ($3)', ["phosphates", 4.0, 2]);
conn.query('UPDATE stats SET ($1) = ($2) WHERE ident = ($3)', ["ph", 6.55, 2]);