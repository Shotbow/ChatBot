const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'time',
    commandAliases: ['now'],
    moment: null,
    Discord: null,
    dependencies: {
        'moment': 'moment',
        'Discord': 'Discord',
    },
    processMessage: function (message, tokens) {
        const now = this.moment().locale(this.i18n.getLocale());
        const cdt = now.tz('America/Chicago');
        const jst = now.clone().tz('Asia/Tokyo');
        const gmt = now.clone().tz('Europe/London');

        const embed = new this.Discord.MessageEmbed();
        embed.addField('Dallas (Shotbow Time)', cdt.format('lll'));
        embed.addField('London', gmt.format('lll'));
        embed.addField('東京', jst.format('lll'));
        embed.setTimestamp(now);

        return message.channel.send(embed);
    }
});
