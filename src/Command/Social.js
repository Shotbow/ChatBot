const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'social',
    processMessage: function (message, tokens) {
        var profiles = {
            'Facebook': 'https://facebook.com/TheShotbowNetwork',
            'Twitter': 'https://twitter.com/ShotbowNetwork',
            'Google+': 'https://google.com/+TheShotbowNetwork',
            'YouTube': 'https://gaming.youtube.com/user/ShotBowNetwork',
            'Player.me': 'https://player.me/?invite=shotbow',
            'Instagram': 'https://instagram.com/shotbownetworkmc/',
            'Tumblr': 'http://tumblr.shotbow.net/',
            'Youku': 'http://i.youku.com/shotbow',
        };
        var formattedProfiles = [];
        for (var key in profiles) formattedProfiles.push(`${key}: <${profiles[key]}>`);
        message.channel.send(`You can follow us online at the following links:\n${formattedProfiles.join("\n")}`);
    }
});