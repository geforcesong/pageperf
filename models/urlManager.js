const config = require('../sys.config.js');
const mysql = require('promise-mysql');
const Page = require('./page.js');

class UrlManager {

    async getUrlsInDb() {
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

    async saveUrls(urls) {
        if (!urls || !urls.length) {
            return;
        }
        for(let item of urls){
            await this.SavePage(item.PageName, item.PageUrl);
        }
    }

    async SavePage(pageName, url) {
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
}

module.exports = UrlManager;