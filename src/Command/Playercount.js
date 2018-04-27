const Command = require('../Command');

const messages = {
    'errorChecking': 'Hmm.. I encountered some issues looking up the players.  Is Shotbow.net offline?',
    'errorBadKey': 'Hmm.. I couldn\'t find the game you were talking about.  Try again?',
    'result': 'There are currently %1 players connected to %2.',
    'help': 'You can use `!playercount` to show the players connected to the network or some of the games.\nYou can use any of the following names: %1'
};

const keyAlias = {
    'hcf': 'hcfactions',
    'anni': 'annihilation',
    'civ-war': 'civwar',
    'civcraft': 'civwar',
    'minetheftauto': 'mta',
    'gc': 'ghostcraft',
    'ghost': 'ghostcraft',
    'mine theft auto': 'mta',
    'death by void': 'dbv',
};

// Map of key to name - also acts as a whitelist
const gameNames = {
    'all': 'Shotbow',
    'annihilation': 'Annihilation',
    'minez': 'MineZ',
    'hcfactions': 'HCFactions',
    'dbv': 'Death by Void',
    'smash': 'SMASH',
    'slaughter': 'Slaughter',
    'civwar': 'Civ-War',
    'gg': 'GG',
    'mta': 'Mine Theft Auto',
    'ghostcraft': 'GhostCraft',
    'lobby': 'Lobby',
};

const roomToGame = {
    '228706232133746688': 'annihilation',
    '228706390883958784': 'dbv',
    '228706280951382016': 'gg',
    '368735807345000449': 'ghostcraft',
    '228706314233184256': 'mta',
    '228706218351394816': 'minez',
    '228706292913537027': 'slaughter',
    '228706345807904768': 'smash',
};

const cacheTTL = 10 * 1000; // 10 seconds in milliseconds

module.exports = Command.extend({
    commandName: 'playercount',
    https: null,
    cache: null,
    cacheKey: 'serverlist',
    dependencies: {
        'discordClient': 'discordClient',
        'commandPrefix': 'commandPrefix',
        'https': 'https',
        'Cache': 'cache'
    },
    processMessage: function (message, tokens) {
        this.fetchServerlist(serverList => {
            if (serverList === false) {
                message.channel.send(messages.errorChecking);
                return;
            }
            tokens.shift();
            let key = this.getGameKey(tokens.join(' ').trim(), message.channel.id);

            if (key === 'help') {
                let list = Object.values(gameNames)
                    .map(item => {
                        return '`' + item + '`'
                    })
                    .join(', ');
                message.channel.send(messages.help.replace('%1', list));
                return;
            }

            if (typeof gameNames[key] === 'undefined' || typeof serverList[key] === 'undefined') {
                message.channel.send(messages.errorBadKey);
                return;
            }

            let gameName = gameNames[key];
            let count = serverList[key];

            message.channel.send(messages.result.replace('%1', count).replace('%2', gameName));
        });
    },
    getGameKey: function (requestedGame, room) {
        if (!requestedGame) {
            return typeof roomToGame[room] !== 'undefined' ? roomToGame[room] : 'all';
        }
        requestedGame = requestedGame.toLowerCase();
        if (keyAlias[requestedGame]) {
            requestedGame = keyAlias[requestedGame];
        }
        return requestedGame;
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
    },
});
