const Class = require('./Class');

module.exports = Class.extend({
    commandList: {},
    add: function (key, command) {
        this.commandList[key] = command;
    },
    has: function (key) {
        return !!this.commandList[key];
    },
    get: function (key) {
        return this.commandList[key];
    },
    allCommands: function () {
        return this.commandList;
    },
});
