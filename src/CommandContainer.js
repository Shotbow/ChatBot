const Class = require('./Class');

module.exports = Class.extend({
    commandList: {},
    aliasList: {},
    addCommand: function (key, command) {
        this.commandList[key] = command;
    },
    addAlias: function (key, commandName) {
        this.aliasList[key] = commandName;
    },
    hasCommand: function (key) {
        return !!this.commandList[key];
    },
    hasAlias: function (key) {
        return !!this.aliasList[key];
    },
    get: function (key) {
        if (this.hasCommand(key)) {
            return this.commandList[key];
        } else if (this.hasAlias(key)) {
            return this.commandList[this.aliasList[key]];
        }
        return null;
    },
    allCommands: function () {
        return this.commandList;
    },
    allAliases: function () {
        return this.aliasList;
    }
});
