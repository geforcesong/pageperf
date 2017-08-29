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
                let length = parseInt(ret.headers['content-length']);
                let result = {
                    body: body,
                    statusCode: ret.statusCode,
                    elapsedTime: ret.elapsedTime,
                    url: this.url,
                    contentLength: isNaN(length) ? 0 : length
                }
                return resolve(result);
            });
        });
    }
}

module.exports = Crawler;
