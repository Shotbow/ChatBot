const Command = require('../Command');

const messages = {
    'errorBadKey': 'Hmm.. I couldn\'t find the game you were talking about.  Try again?',
    'result': 'You can talk all about {game} here: <{link}>',
    'help': 'You can use `!forums` to get a link to the forum in general or for a specific game.\nYou can use any of the following names: {names}'
};

module.exports = Command.extend({
    commandName: 'forums',
    processMessage: function (message, tokens) {
        tokens.shift();
        let key = this.getGameKey(tokens.join(' ').trim(), message.channel.id);

        if (key === 'help') {
            let list = Object.values(this.config.games.names)
                .map(item => {
                    return '`' + item + '`'
                })
                .join(', ');
            message.channel.send(this.i18n.__mf(messages.help, {names: list}));
            return;
        }

        if (typeof this.config.games.names[key] === 'undefined') {
            message.channel.send(this.i18n.__mf(messages.errorBadKey, {key: key}));
            return;
        }

        let gameName = this.config.games.names[key];
        let URL = this.config.games.forums[key];

        message.channel.send(this.i18n.__mf(messages.result, {link: URL, game: gameName}));
    },
    getGameKey: function (requestedGame, room) {
        if (!requestedGame) {
            return typeof this.config.games.rooms[room] !== 'undefined' ? this.config.games.rooms[room] : 'all';
        }
        requestedGame = requestedGame.toLowerCase();
        if (this.config.games.aliases[requestedGame]) {
            requestedGame = this.config.games.aliases[requestedGame];
        }
        return requestedGame;
    },
});
