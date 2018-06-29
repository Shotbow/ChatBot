const Command = require('../Command');

const messages = {
    forumsLink: 'The forums can be found by navigating to {link}.'
};

module.exports = Command.extend({
    commandName: 'forums',
    commandAliases: ['forum'],
    processMessage: function (message, tokens) {
        tokens.shift();
        let link = this.getForumsLink(tokens.join(' ').trim(), message.channel.id);

        message.channel.send(this.i18n.__mf(messages.forumsLink, {link: link}));
    },
    getForumsLink: function (requestedGame, room) {
        if (!requestedGame) {
            if (typeof this.config.games.rooms[room] !== 'undefined') {
                return this.config.games.forums[this.config.games.rooms[room]];
            } else {
                return this.config.games.forums['all'];
            }
        } else {
            requestedGame = requestedGame.toLowerCase();
            if (this.config.games.forums[requestedGame]) {
                return this.config.games.forums[requestedGame];
            } else if (this.config.games.aliases[requestedGame]) {
                return this.config.games.forums[this.config.games.aliases[requestedGame]];
            } else {
                return this.config.games.forums['all'];
            }
        }
    }
});
