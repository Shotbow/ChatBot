const Command = require('../Command');

const messages = {
    noGame: 'You must specify one of the available notifications to subscribe to: {types}',
    notifyGameSeparator: 'NOTIFY_GAME_SEPARATOR',
    cantGrant: 'I was unable to grant you the role.',
    success: 'Your role has been granted.'
};

module.exports = Command.extend({
    config: null,
    shouldDeleteMessage: true,
    commandName: 'notifyme',
    commandAliases: ['notifywarband', 'wbnotify', 'war', 'warbandnotify'],
    dependencies: {
        'config': 'config'
    },
    initialize: function (dependencyGraph) {
        this._super(dependencyGraph);
    },
    processMessage: async function (message, tokens, commandName) {
        let notifyGame;
        if (this.commandAliases.indexOf(commandName) >= 0) {
            notifyGame = 'warband';
        } else if (tokens.length < 2) {
            return message.channel.send(this.i18n.__mf(
                messages.noGame,
                {
                    types: Object.keys(this.config.notificationRoles).join(this.i18n.__mf(messages.notifyGameSeparator))
                }
            ));
        } else {
            notifyGame = tokens[1].toLowerCase();
        }

        if (!(notifyGame in this.config.notificationRoles)) {
            return message.channel.send(this.i18n.__mf(
                messages.noGame,
                {
                    types: Object.keys(this.config.notificationRoles).join(this.i18n.__mf(messages.notifyGameSeparator))
                }
            ));
        }

        const role = message.guild.roles.cache.get(this.config.notificationRoles[notifyGame]);

        let result;
        message.member.roles.add(role)
            .catch(error => {
                console.error(error);
                result = message.channel.send(this.i18n.__mf(messages.cantGrant))
                    .catch(error => { console.error(error) });
            });
        if (result) {
            return result;
        }

        return message.channel.send(this.i18n.__mf(messages.success));
    }
});
