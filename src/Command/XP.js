const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'xp',
    advertisable: false,
    processMessage: function (message, tokens) {
        message.channel.send("We have a **special** XP code for people who ask for one! Try `IASKEDFORXP`!");
    }
});
