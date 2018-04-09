var Command = require("../command");

module.exports.vote = new Command(
	function() {
		var votes = {
	    	'Planet Minecraft': 'http://www.planetminecraft.com/server/minez-1398788/',
	    	'Minecraft Forum': 'http://minecraftforum.net/servers/160-shotbow',
	    	'MinecraftServers.org': 'http://minecraftservers.org/server/267066'
		};
		var URLVotes = [];
		for (var key in votes) URLVotes.push(`${key}: <${votes[key]}>`);
		return {
			"votes": URLVotes
		};
	},
	function(message, argument) {
		message.channel.send(`Support Shotbow for free by voting for us on the following sites:\n${this.dependencies.votes.join("\n")}`);
	}
);