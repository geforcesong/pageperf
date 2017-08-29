const UrlManager = require('./models/urlManager.js');
const argv = require('minimist')
var args = argv(process.argv.slice(2));

if (!args.sp) {
    throw new Error('You must spcify the sprint by using --sp');
}

; (async _ => {
    let urlManager = new UrlManager();
    let urls = await urlManager.getUrlsInDb(args);
    await urlManager.saveUrls(urls, {
        sprintName: args.sp,
        saveToDb: !args.nosave
    });
    console.log('done!');
})();