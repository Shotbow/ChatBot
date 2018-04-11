const Class = require('./Class');

module.exports = Class.extend({
    commandList: {},
    add: function (key, command) {
        this.commandList[key] = command;
    },
    get: function (key) {
        return this.commandList[key];
    },
    all: function() {
        return this.commandList;
    }
});