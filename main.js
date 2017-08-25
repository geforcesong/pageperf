const UrlManager = require('./models/urlManager.js');
const argv = require('minimist')
var args = argv(process.argv.slice(2));

;(async _ => {
    let urlManager =  new UrlManager();
    let urls = await urlManager.getUrlsInDb();
    await urlManager.saveUrls(urls, {
        sprintName: args.sp
    });
    console.log('done!');
})();