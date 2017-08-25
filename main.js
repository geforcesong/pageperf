const UrlManager = require('./models/urlManager.js');
const argv = require('minimist')

;(async _ => {
    let urlManager =  new UrlManager();
    let urls = await urlManager.getUrlsInDb();
    await urlManager.saveUrls(urls);
    console.log('done!');
})();