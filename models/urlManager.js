const config = require('../sys.config.js');
const mysql = require('promise-mysql');
const Page = require('./page.js');

class UrlManager {

    async getUrlsInDb(options) {
        return new Promise((resolve, reject) => {
            if (options.url) {
                return resolve([{ PageUrl: options.url }]);
            }
            let connection = null;
            mysql.createConnection(config.databaseConnection).then(function (conn) {
                connection = conn;
                let sql = 'select * from PageSource;';
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

    async saveUrls(urls, options) {
        if (!urls || !urls.length) {
            return;
        }
        for (let item of urls) {
            await this.SavePage(item.PageName, item.PageUrl, options);
        }
    }

    async SavePage(pageName, url, options) {
        if (!url) {
            return '';
        }
        let page = new Page(pageName, url, options.sprintName);
        return new Promise((resolve, reject) => {
            page.analyze().then((self) => {
                if (options.saveToDb) {
                    return self.save();
                }
                console.log('Do not need save for this URL');
                return null;
            }).then((d) => {
                return resolve(true);
            }).catch((err) => {
                return reject(err);
            });
        })
    }
}

module.exports = UrlManager;