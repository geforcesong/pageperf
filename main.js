const Page = require('./models/page.js');
const config = require('./sys.config.js');
const mysql = require('promise-mysql');



// let page = new Page('DPP', 'http://alpaca.san-mateo.movoto.net:3025/san-francisco-ca/887-47th-ave-san-francisco-ca-94121-100_ml81673734/for-sale/?perfdebugger=1');

// page.analyze().then((self)=>{
//     self.save();
// });

function getUrlsInDb() {
    return new Promise((resolve, reject) => {
        let connection = null;
        mysql.createConnection(config.databaseConnection).then(function (conn) {
            connection = conn;
            let sql = 'select * from PageSource where IsNewAdded = 1;';
            return conn.query(sql);
        }).then((rows) => {
            connection && connection.end();
            return resolve(rows);
        }).catch((err) => {
            console.log(err);
            connection && connection.end();
            return resolve(null);
        });
    });
}


getUrlsInDb().then((urls) => {
    saveUrls(urls);
});

async function saveUrls(urls) {
    if (!urls || !urls.length) {
        return;
    }
    for(let item of urls){
        await SavePage(item.PageName, item.PageUrl);
    }
    console.log('done') ;
}

async function SavePage(pageName, url) {
    if (!url) {
        return '';
    }
    let page = new Page(pageName, url);
    return new Promise((resolve, reject)=>{
        page.analyze().then((self) => {
            return self.save();
        }).then((d)=>{
            return resolve(true);
        }).catch((err)=>{
            return reject(err);
        });
    })
}

// ;(async _ => {

//     await SavePage('DPP', 'http://alpaca.san-mateo.movoto.net:3025/san-francisco-ca/887-47th-ave-san-francisco-ca-94121-100_ml81673734/for-sale/?perfdebugger=1');
//     console.log('done') ;
// })();