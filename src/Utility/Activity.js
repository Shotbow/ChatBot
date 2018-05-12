const BotModule = require('../BotModule');

const cacheTTL = 10 * 1000; // 10 seconds in milliseconds
const updateInterval = 60 * 1000 // 1 minute in milliseconds

module.exports = BotModule.extend({
    https: null,
    cache: null,
    cacheKey: 'serverlist',
    dependencies: {
        'https': 'https',
        'Cache': 'cache'
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
        setInterval(() => {
            this.fetchServerlist(serverList => {
                if (serverList === false) {
                    this.discordClient.user.setActivity('on Shotbow');
                    return;
                }
                this.discordClient.user.setActivity(`on Shotbow with ${serverList.all} others`);
            });
        }, updateInterval);
    },
    fetchServerlist: function (callback) {
        let cachedData = this.cache.get(this.cacheKey);
        if (cachedData) {
            callback(cachedData);
            return;
        }
        try {
            this.https.get('https://shotbow.net/serverList.json', res => {
                let responseData = '';
                res.setEncoding('utf8');
                res.on('data', data => {
                    responseData += data;
                });
                res.on('end', () => {
                    let serverList;
                    try {
                        serverList = JSON.parse(responseData);
                        if (serverList !== false) {
                            this.cache.set(this.cacheKey, serverList, cacheTTL);
                        }
                        callback(serverList);
                    } catch (e) {
                        callback(false);
                    }
                });
            });
        } catch (e) {
            console.error(e);
            callback(false);
        }
    }
});
