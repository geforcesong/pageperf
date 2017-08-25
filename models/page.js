const Crawler = require('../utilities/crawler.js');
const config = require('../sys.config.js');
const mysql = require('promise-mysql');
class Page {
    constructor(pageName, url, sprintName) {
        this.pageName = pageName;
        this.pageUrl = url;
        if (this.pageUrl.indexOf('?perfdebugger=1') < 0) {
            this.pageUrl += '?perfdebugger=1';
        }
        this.pagePerfDetails = [];
        this.pageId = undefined;
        this.sprintName = sprintName || '';
    }

    save() {
        let connection = undefined;
        let self = this;
        return mysql.createConnection(config.databaseConnection).then(function (conn) {
            connection = conn;
            let sql = `INSERT INTO PagePerf(PageName, PageUrl, ElapsedTime, TestLocation, CreateTime, StatusCode, SprintName) Values('${self.pageName}', '${self.pageUrl}', ${self.elapsedTime}, 'Shanghai', now(), ${self.statusCode}, '${self.sprintName}');`;
            return conn.query(sql);
        }).then((rows) => {
            self.pageId = (rows && rows.insertId) ? rows.insertId : 0;
            if (!self.pageId) {
                connection && connection.end();
                throw new Error('Page Id is not set correctly');
            }
            let sql = '';
            if (self.pagePerfDetails && self.pagePerfDetails.length) {
                // self.pagePerfDetails =self.pagePerfDetails.slice(0,1);
                for (let item of self.pagePerfDetails) {
                    sql += `INSERT INTO PagePerfDetail(PageId, MethodName, TimeSpend, CreateTime) Values(${self.pageId}, '${item.methodName}', ${item.timeSpend}, now());`;
                }
                return connection.query(sql);
            }
            return null;
        }).then((rows) => {
            console.log(`Page ${self.pageId} saved successfully!`);
            connection && connection.end();
        }).catch((err) => {
            console.log(err);
        });
    }

    analyze() {
        let self = this;
        return new Promise((resolve, reject) => {
            var crawler = new Crawler(this.pageUrl);
            crawler.crawl().then((ret) => {
                self.elapsedTime = ret.elapsedTime;
                self.statusCode = ret.statusCode;
                self._analyzeBody(ret.body);
                return resolve(self);
            });
        });
    }

    _analyzeBody(body) {
        if (!body) {
            return;
        }
        let reg = /window.debugLogger.*];/ig;
        let resultStr = body.match(reg);
        if (resultStr && resultStr.length) {
            resultStr = resultStr[0].replace('window.debugLogger =', '').trim();
            resultStr = resultStr.substring(0, resultStr.length - 1);
            try {
                let result = JSON.parse(resultStr);
                for (let item of result) {
                    let arr = item.split(':');
                    let methodName = arr[0].trim();
                    let timeSpend = parseInt(arr[1]);
                    if (isNaN(timeSpend)) {
                        timeSpend = -1;
                    }
                    this.pagePerfDetails.push({
                        methodName: methodName,
                        timeSpend: timeSpend
                    });
                }
            } catch (error) {
                console.log(error);
                this.pagePerfDetails = [];
            }
        }
    }
}

module.exports = Page;
