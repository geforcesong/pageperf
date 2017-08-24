class Page {
    constructor(pageName, url) {
        this.pageName = pageName;
        this.pageUrl = url;
        this.pagePerfDetails = [];
    }

    save() {
        return true;
    }
}

module.exports = Page;