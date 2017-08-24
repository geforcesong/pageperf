const Crawler = require('./crawler.js');
const config  = require('./sys.config.js');
class Page {
    constructor(pageName, url) {
        this.pageName = pageName;
        this.pageUrl = url;
        this.pagePerfDetails = [];
    }

    save() {
        return true;
    }

    analyze() {
        let self = this;
        return new Promise((resolve, reject) => {
            var crawler = new Crawler(this.pageUrl);
            crawler.crawl().then((ret) => {
                self.elapsedTime = ret.elapsedTime;
                self._analyzeBody(ret.body);
                return resolve(true);
            });
        });
    }

    _analyzeBody(body) {
        if (!body) {
            return;
        }
        let reg = /window.debugLogger.*\];$/ig;
        let result = body.match(reg);
        console.log(result);
    }
}

module.exports = Page;
