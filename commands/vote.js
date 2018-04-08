module.exports.execute = function(message, argument) {
	var votes = {
    	'Planet Minecraft': 'http://www.planetminecraft.com/server/minez-1398788/',
    	'Minecraft Forum': 'http://minecraftforum.net/servers/160-shotbow',
    	'MinecraftServers.org': 'http://minecraftservers.org/server/267066'
	};
	var URLVotes = [];
	for (var key in votes) URLVotes.push(`${key}: <${votes[key]}>`);
	message.channel.send(`Support Shotbow for free by voting for us on the following sites:\n${URLVotes.join("\n")}`);
}