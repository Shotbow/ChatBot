const config = require('config');

module.exports = {
    getKeyFromChannel: function (channel) {
        return typeof config.games.rooms[channel.id] !== 'undefined' ? config.games.rooms[channel.id] : null;
    },
    getKeyFromText: function (text) {
        text = text.toLowerCase();
        if (config.games.aliases[text]) {
            text = config.games.aliases[text];
        }
        return typeof config.games.names[text] !== 'undefined' ? text : null;
    }
}
