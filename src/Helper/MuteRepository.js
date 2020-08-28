const Class = require('../Class');

module.exports = Class.extend({
    mutes: {},

    add: function (id) {
        this.mutes[id] = true;
    },

    has: function (id) {
        return this.mutes.hasOwnProperty(id) && this.mutes[id];
    },

    remove: function (id) {
        delete this.mutes[id];
    }
});
