const Command = require('../Command');

const messages = {
    'errorChecking': 'Hmm.. I encountered some issues looking up the players.  Is Shotbow.net offline?',
    'errorBadKey': 'Hmm.. I couldn\'t find the game you were talking about.  Try again?',
    'result': 'There { count, plural, one {is currently # player} other {are currently # players} } connected to {game}.',
    'help': 'You can use `!playercount` to show the players connected to the network or some of the games.\nYou can use any of the following names: {names}'
};

const cacheTTL = 10 * 1000; // 10 seconds in milliseconds

module.exports = Command.extend({
    shouldDeleteMessage: true,
    commandName: 'playercount',
    https: null,
    cache: null,
    cacheKey: 'serverlist',
    dependencies: {
        'commandPrefix': 'commandPrefix',
        'https': 'https',
        'Cache': 'cache'
    },
    processMessage: async function (message, tokens) {
        return await this.fetchServerlist().then(serverList => {
            if (serverList === false) {
                return message.channel.send(this.i18n.__mf(messages.errorChecking));
            }
            tokens.shift();
            let key = this.getGameKey(tokens.join(' ').trim(), message.channel.id);

            if (key === 'help') {
                let list = Object.values(this.config.games.names)
                    .map(item => {
                        return '`' + item + '`'
                    })
                    .join(', ');
                return message.channel.send(this.i18n.__mf(messages.help, {names: list}));
            }

            if (typeof this.config.games.names[key] === 'undefined' || typeof serverList[key] === 'undefined') {
                return message.channel.send(this.i18n.__mf(messages.errorBadKey, {key: key}));
            }

            let gameName = this.config.games.names[key];
            let count = serverList[key];

            return message.channel.send(this.i18n.__mf(messages.result, {count: count, game: gameName}));
        }).catch(e => {
            console.error(e);
        });
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
    fetchServerlist: function() {
        return new Promise((resolve, reject) => {
            let cachedData = this.cache.get(this.cacheKey);
            if (cachedData) {
                resolve(cachedData);
                return;
            }
            
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
                        resolve(serverList);
                    } catch (e) {
                        resolve(false);
                    }
                });
            });
        });
    }
});
