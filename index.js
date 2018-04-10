const Discord = require('discord.js');
const tokens = require("./token");
const instantiateCommands = require("./conf");
const client = new Discord.Client();

const commandList = new (require('./src/CommandContainer'));
const dependencyGraph = {
	'discordClient': client,
	'commandPrefix': '!',
	'commandList': commandList,
};
for (let key in instantiateCommands) {
	if (!instantiateCommands.hasOwnProperty(key)) continue;
	let commandPath = './src/Command/' + instantiateCommands[key];
	let command = new (require(commandPath));
	command.initialize(dependencyGraph);

	commandList.add(key, command);
}

client.on('ready', () => {
	client.user.setActivity("on Shotbow");
	console.log("Successfully logged in!");
});

client.login(tokens.getToken());