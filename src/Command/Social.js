const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'social',
    commandAliases: ['twitter', 'facebook', 'youtube', 'googleplus', 'gplus', 'google+', 'youku', 'playerme', 'instagram', 'tumblr'],
    processMessage: function (message, tokens) {
        let profiles = {
            'Facebook': 'https://facebook.com/TheShotbowNetwork',
            'Twitter': 'https://twitter.com/ShotbowNetwork',
            'Google+': 'https://google.com/+TheShotbowNetwork',
            'YouTube': 'https://gaming.youtube.com/user/ShotBowNetwork',
            'Player.me': 'https://player.me/?invite=shotbow',
            'Instagram': 'https://instagram.com/shotbownetworkmc/',
            'Tumblr': 'http://tumblr.shotbow.net/',
            'Youku': 'http://i.youku.com/shotbow',
        };
        let formattedProfiles = [];
        for (let key in profiles) formattedProfiles.push(`${key}: <${profiles[key]}>`);
        message.channel.send(this.i18n.__mf('You can follow us online at the following links:\n') + formattedProfiles.join("\n"));
    }
});
