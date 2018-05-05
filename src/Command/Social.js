const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'social',
    commandAliases: ['twitter', 'facebook', 'youtube', 'googleplus', 'gplus', 'google+', 'youku', 'playerme', 'instagram', 'tumblr'],
    config: null,
    dependencies: {
        'config': 'config'
    },
    processMessage: function (message, tokens) {
        let profiles = this.config.profiles;
        let formattedProfiles = [];
        for (let key in profiles) formattedProfiles.push(`${key}: <${profiles[key]}>`);
        message.channel.send(this.i18n.__mf('You can follow us online at the following links:\n') + formattedProfiles.join("\n"));
    }
});
