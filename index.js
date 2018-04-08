const Discord = require('discord.js');
const tokens = require("./token");
const conf = require("./conf");
const client = new Discord.Client();

client.on('ready', () => {
	client.user.setGame("on Shotbow");
	console.log("Successfully logged in!");
});

client.on('message', message => {
	if (message.content.substr(0, 1) == "!") {
		var separate = message.content.split(" ");
		var command = separate[0].substr(1).toLowerCase();
		var argument = 1 in separate ? separate[1].toLowerCase() :  null;
		
		if (command in conf.commands) {
			conf.commands[command].execute(message, argument);
		}
		else if (command in conf.hiddenCommands) {
			conf.hiddenCommands[command].execute(message, argument);
		}
		else if (command in conf.aliases) {
			conf.commands[conf.aliases[command]].execute(message, argument);
		}
	}
	else if (message.content.toLowerCase().includes("shitbow")) {
		message.delete();
	}
});

client.login(tokens.getToken());