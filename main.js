const Page = require('./page.js');

// let page = new Page('DPP', 'http://alpaca.san-mateo.movoto.net:3025/san-francisco-ca/887-47th-ave-san-francisco-ca-94121-100_ml81673734/for-sale/?perfdebugger=1');

// page.analyze();
const config  = require('./sys.config.js');
var mysql = require('promise-mysql');

mysql.createConnection(config.databaseConnection).then(function(conn){
    // do stuff with conn 
    conn.end();
});
