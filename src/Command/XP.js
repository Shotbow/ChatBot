const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'xp',
    commandAliases: ['xpcode'],
    advertisable: false,
    processMessage: function (message, tokens) {
        message.channel.send(this.i18n.__mf("We have a **special** XP code for people who ask for one! Try `{code}`!", {code: 'IASKEDFORXP'}));
    }
});
