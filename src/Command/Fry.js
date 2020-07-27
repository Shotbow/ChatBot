const Command = require('../Command');

const messages = {
    who: 'Yes master... but who?',
    obey: 'I must obey my masters...\n\n*zaps {victim} with 10,000 volts of electricity*',
    accessDenied: "I'm sorry, but you're not yet strong enough... only masters can fry. However, I like you, so I won't punish you...",
    accessWHOLYDenied: 'I try not to be violent... but you all just keep pushing me...\n\n*zaps {victim} with an electric shock!*',
};

module.exports = Command.extend({
    commandName: 'fry',
    advertisable: false,
    shouldDeleteMessage: true,
    processMessage: function (message, tokens) {
        tokens.shift();
        let victim = tokens.join(" ");
        let hasRoles = message.member !== null && typeof message.member.roles !== 'undefined';
        // If the person sending the message is an admin OR is whitelisted on the configs
        if (hasRoles && (message.member.roles.cache.has(message.guild.roles.cache.find(role => role.name === "Administrator").id) || this.config.zaplist.indexOf(message.author.id) > -1)) {
            if (victim === '') return message.channel.send(this.i18n.__mf(messages.who));
            else return message.channel.send(this.i18n.__mf(messages.obey, {victim: victim}));
        // If the person sending the message is a mini admin or moderator
        } else if (hasRoles && (message.member.roles.cache.has(message.guild.roles.cache.find(role => role.name === "Mini-Admin").id) || message.member.roles.cache.has(message.guild.roles.cache.find(role => role.name === "Moderator").id))) {
            return message.channel.send(this.i18n.__mf(messages.accessDenied));
        } else {
            return message.channel.send(this.i18n.__mf(messages.accessWHOLYDenied, {victim: message.author.toString()}));
        }
    }
});
