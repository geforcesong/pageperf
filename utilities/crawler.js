const util = require('util');
const Request = util.promisify(require('request'));
class Crawler {
    constructor(url) {
        this.url = url;
    }

    crawl() {
        return new Promise((resolve, reject) => {
            let options = {
                url: this.url,
                time: true
            }
            Request(options).then((ret) => {
                let body = (ret && ret.body) ? ret.body : undefined;
                let result = {
                    body: body,
                    statusCode: ret.statusCode,
                    elapsedTime: ret.elapsedTime,
                    url: this.url
                }
                return resolve(result);
            });
        });
    }
}

module.exports = Crawler;
