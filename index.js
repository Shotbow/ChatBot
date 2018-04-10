const Discord = require('discord.js');
const tokens = require("./token");
const instantiateCommands = require("./conf");
const client = new Discord.Client();

const commandList = require('./src/CommandContainer');
const dependencyGraph = {
	'discordClient': client,
	'commandPrefix': '!',
	'commandList': commandList,
};
for (let key in instantiateCommands) {
	if (!instantiateCommands.hasOwnProperty(key)) continue;
	let commandPath = './src/Command/' + instantiateCommands[key];
	let commandDefinition = require(commandPath);
	let command = commandDefinition();
	command.initialize(dependencyGraph);

	commandList.add(key, command);
}

client.on('ready', () => {
	client.user.setGame("on Shotbow");
	console.log("Successfully logged in!");
});

client.login(tokens.getToken());