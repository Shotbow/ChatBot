const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'warbandnotify',
    commandAliases: ['notifywarband', 'wbnotify'],
    advertisable: false,
    processMessage: function (message, tokens) {
        message.delete();

        message.member.roles.add(message.guild.roles.cache.find(role => role.name === 'Warband Playtester'))
            .catch(error => {
                message.channel.send(this.i18n.__mf('I was unable to grant you the role for some reason. My permissions may be messed up.'))
                    .catch(error => {
                        console.log("Not enough permissions to send a message to the chatroom.");
                    });
            });
    }
});
