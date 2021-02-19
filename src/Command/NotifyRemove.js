const Command = require('../Command');

const messages = {
    noGame: 'You must specify one of the available notifications to unsubscribe from: {types}',
    notifyGameSeparator: 'NOTIFY_GAME_SEPARATOR',
    cantRemove: 'I was unable to remove the role from your user.',
    success: 'Your role has been removed.'
};

module.exports = Command.extend({
    config: null,
    shouldDeleteMessage: true,
    commandName: 'notifyremove',
    commandAliases: ['unwar'],
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
        try {
            await message.member.roles.remove(role);
        } catch (error) {
            console.error(error);
            result = await message.channel.send(this.i18n.__mf(messages.cantRemove));
        }

        if (result) {
            return result;
        }

        return message.channel.send(this.i18n.__mf(messages.success));
    }
});
