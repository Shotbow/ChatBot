const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'vote',
    processMessage: function (message, tokens) {
        let votes = {
            'Planet Minecraft': 'http://www.planetminecraft.com/server/minez-1398788/',
            'Minecraft Forum': 'http://minecraftforum.net/servers/160-shotbow',
            'MinecraftServers.org': 'http://minecraftservers.org/server/267066'
        };
        let formattedVotes = [];
        for (let key in votes) formattedVotes.push(`${key}: <${votes[key]}>`);
        message.channel.send(this.i18n.__mf('Support Shotbow for free by voting for us on the following sites:\n') + formattedVotes.join("\n"));
    }
});
