const Dependant = require('./Dependant');

module.exports = Dependant.extend({
    cacheData: {},
    cacheTime: {},
    cacheTTL: {},
    defaultTTL: 0,
    time: null,
    dependencies: {
        'Date': 'time'
    },

    /**
     * @returns {number} Current time in milliseconds
     */
    now: function () {
        return (new (this.time)).getTime();
    },

    /**
     * Check for the existence of cached data under a given key
     *
     * @param {string} key
     * @returns {boolean}
     */
    has: function (key) {
        return typeof this.cacheData[key] !== 'undefined';
    },

    /**
     * Retrieve cached data using a given key
     *
     * @param {string} key
     * @returns {*}
     */
    get: function (key) {
        if (!this.has(key)) {
            return false;
        }
        let now = this.now();
        if (this.cacheTime[key] + this.cacheTTL[key] > now) {
            return this.cacheData[key];
        }

        return false;
    },

    /**
     * Cache data under a given key for a given time
     *
     * @param {string} key
     * @param {*} data
     * @param {number} ttl Time to live in milliseconds.  If not specified, defaults to this.defaultTTL
     */
    set: function (key, data, ttl) {
        if (typeof ttl === 'undefined') {
            ttl = this.defaultTTL;
        }
        this.cacheTime[key] = this.now();
        this.cacheData[key] = data;
        this.cacheTTL[key] = ttl;
    }
});
