const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'fry',
    advertisable: false,
    processMessage: function (message, tokens) {
    	tokens.shift();
    	let victim = tokens.join(" ");
		// If the person sending the message is an admin OR is Mistri
		if (message.member.roles.has(message.guild.roles.find("name", "Administrator").id) || message.author.id == "173556767383355392") {
			if (victim == null) message.channel.send("Yes master... but who?");
			else message.channel.send("I must obey my masters...\n\n*zaps " + victim + " with 10,000 volts of electricity*");
		// If the person sending the message is a mini admin or moderator
		} else if (message.member.roles.has(message.guild.roles.find("name", "Mini-Admin").id) || message.member.roles.has(message.guild.roles.find("name", "Moderator").id)) {
			message.channel.send("I'm sorry, but you're not yet strong enough... only masters can fry. However, I like you, so I won't punish you...");
		} else {
			message.channel.send("I try not to be violent... but you all just keep pushing me...\n\n*zaps " + message.author.toString() + " with an electric shock!*");
		}
    }
});
