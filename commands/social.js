var Command = require("../command");

module.exports.social = new Command(
    function() {
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
        var URLProfiles = [];
        for (var key in profiles) URLProfiles.push(`${key}: <${profiles[key]}>`);
        return {
            "profiles": URLProfiles
        };
    },
    function(message, argument) {
        message.channel.send(`You can follow us online at the following links:\n${this.dependencies.profiles.join("\n")}`);
    }
);