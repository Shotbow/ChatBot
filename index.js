const Discord = require('discord.js');
const https = require("https");
const tokens = require("./token.js");
const client = new Discord.Client();

client.on('ready', () => {
	client.user.setGame("on Shotbow");
	console.log("Successfully logged in!");
});

client.on('message', message => {
	if (message.content.substr(0, 1) !== "!") return;
	var separate = message.content.split(" ");
	var command = separate[0].substr(1).toLowerCase();
	var argument = 1 in separate ? separate[1].toLowerCase() :  null;
	if (getListOfCommands().indexOf(command) > -1) {
		executeCommand(command, message, argument);
	} else if (getListOfHiddenCommands().indexOf(command) > -1) {
		if (message.channel.name !== "shoutbox") return;
		executeCommand(command, message, argument);
	} else if (command in getListOfAliases()) {
		executeCommand(getListOfAliases()[command], message, argument);
	}
});

client.login(tokens.getToken());

function getListOfCommands() {
	return [
		'commands',
		'rules',
		'banned',
		'report',
		'staff',
		'social',
		'stuck',
		'about',
		'bug',
		'ts',
		'ip',
		'vote',
		'mcstatus',
		'radio',
		'why',
		'contact'
	];
}

function getListOfAliases() {
	return {
		'twitter': 'social',
		'facebook': 'social',
		'youtube': 'social',
		'googleplus': 'social',
		'gplus': 'social',
		'youku': 'social',
		'playerme': 'social',
		'instagram': 'social',
		'tumblr': 'social',
		'contactus': 'contact',
		'command': 'commands',
		'help': 'commands',
		'bugs': 'bug',
		'bugreport': 'bug',
		'address': 'ip',
		'teamspeak': 'ts',
		'mumble': 'ts',
		'hacker': 'report'
	};
}

function getListOfHiddenCommands() {
	return [
		'fry',
		'xp'
	];
}

function executeCommand(command, message, argument) {
	switch (command) {
		case 'commands':
			var commands = getListOfCommands();
			for (var i = 0; i < commands.length; i ++) commands[i] = `\`!${commands[i]}\``;
			message.channel.send(`All available commands: ${commands.join(", ")}`);
			break;
		case 'rules':
			message.channel.send("Please read our rules here: <https://shotbow.net/forum/p/rules/>");
			break;
		case 'banned':
			message.channel.send("We do not discuss bans in the chatroom. If you are banned, please post a ban appeal — it is the fastest way to get your ban handled! <https://shotbow.net/forum/forums/banappeals/>");
			break;
		case 'report':
			message.channel.send("To report a malicious player, follow our Report a Player guidelines here: <https://shotbow.net/forum/threads/report-a-player-guidelines-read-me-before-posting.344869/>\n\nAre they in game right now?  Type `/report <name>` to report them to our currently online staff!");
			break;
		case 'staff':
			message.channel.send("View the official Shotbow Staff List here: <https://shotbow.net/forum/wiki/shotbow-staff>");
			break;
		case 'social':
			var profiles = {
	            'Facebook': 'https://facebook.com/TheShotbowNetwork',
	            'Twitter': 'https://twitter.com/ShotbowNetwork',
	            'Google+': 'https://google.com/+TheShotbowNetwork',
	            'YouTube': 'https://gaming.youtube.com/user/ShotBowNetwork',
	            'Player.me': 'https://player.me/?invite=shotbow',
	            'Instagram': 'https://instagram.com/shotbownetworkmc/',
	            'Tumblr': 'http://tumblr.shotbow.net/',
	            'Youku': 'http://i.youku.com/shotbow',
	        };
	        var URLProfiles = [];
	        for (var key in profiles) URLProfiles.push(`${key}: <${profiles[key]}>`);
			message.channel.send(`You can follow us online at the following links:\n${URLProfiles.join("\n")}`);
			break;
		case 'stuck':
			message.channel.send("Stuck in a block or area on MineZ? Request to be moved here: <https://shotbow.net/forum/threads/stuck-in-a-block-or-area.266338/>");
			break;
		case 'about':
			message.channel.send("Hi there! My name is **Chat Bot** and I'm an open-sourced Discord bot made specifically for the Shotbow Shoutbox. You can view my code and contribute to me here: <https://github.com/Shotbow/DiscordChatBot>");
			break;
		case 'bug':
			message.channel.send("Help keep our games stable by reporting bugs here: <https://shotbow.net/forum/p/bugs/>");
			break;
		case 'ts':
			message.channel.send("You can connect to our TeamSpeak at `ts.shotbow.net` (but, by personal preference, Discord is better).");
			break;
		case 'ip':
			message.channel.send("Come join me on Shotbow using the IP `play.shotbow.net`!");
			break;
		case 'vote':
	        var votes = {
            	'Planet Minecraft': 'http://www.planetminecraft.com/server/minez-1398788/',
            	'Minecraft Forum': 'http://minecraftforum.net/servers/160-shotbow',
            	'MinecraftServers.org': 'http://minecraftservers.org/server/267066'
        	};
        	var URLVotes = [];
        	for (var key in votes) URLVotes.push(`${key}: <${votes[key]}>`);
			message.channel.send(`Support Shotbow for free by voting for us on the following sites:\n${URLVotes.join("\n")}`);
			break;
		case 'mcstatus':
			https.get("https://status.mojang.com/check", res => {
				var status = "";
				res.setEncoding("utf8");
				res.on("data", data => {
					status += data;
				});
				res.on("end", () => {
					status = JSON.parse(status);
					var formattedStatus = {};
					for (var i = 0; i < status.length; i ++) {
						for (var key in status[i]) {
							formattedStatus[key] = status[i][key];
						}
					}
					var errors = [];
					for (var key in formattedStatus) {
						if (formattedStatus[key] !== "green") {
							if (formattedStatus[key] == "yellow") errors.push(`- \`${key}\` is having some issues`);
							else if (formattedStatus[key] == "red") errors.push(`- \`${key}\` is completely down`);
						}
					}
					if (errors.length == 0) message.channel.send("I just checked Mojang's servers, and everything seems to be working fine!");
					else message.channel.send(`I just checked Mojang's servers, and there appear to be some issues:\n${errors.join("\n")}`);
				});
			});
			break;
		case 'radio':
			message.channel.send("Did you know we have our own radio? Listen to Mine Theft Auto's radio here: <https://www.minetheftauto.com/radio/>");
			break;
		case 'why':
			message.channel.send("That's a good question. Why *does* Shotbow have chat? Chat is not for live admin assistance, it's to help foster the wonderful Shotbow community. Ask questions, and if staff is around they will answer. You can also type `!commands` to see what other tricks I have and the information I can give you!");
			break;
		case 'contact':
			message.channel.send("Some issues, like rank or payment issues, can only be fixed by contacting support through the \"Contact Us\" link, which can be found here: <https://shotbow.net/forum/contact>\n\nPlease allow two business days for a response.");
			break;
		case 'fry':
			// If the person sending the message is an admin OR is Mistri
			if (message.member.roles.has(message.guild.roles.find("name", "Administrator").id)|| message.author.id == "173556767383355392") {
				if (argument == null) message.channel.send("Yes master... but who?");
				else message.channel.send("I must obey my masters...\n\n*zaps " + argument + " with 10,000 volts of electricity*");
			// If the person sending the message is a mini admin or moderator
			} else if (message.member.roles.has(message.guild.roles.find("name", "Mini-Admin").id) || message.member.roles.has(message.guild.roles.find("name", "Moderator").id)) {
				message.channel.send("I'm sorry, but you're not yet strong enough... only masters can fry. However, I like you, so I won't punish you...");
			} else {
				message.channel.send("I try not to be violent... but you all just keep pushing me...\n\n*zaps " + message.author.toString() + " with an electric shock!*");
			}
			break;
		case 'xp':
			message.channel.send("We have a **special** XP code for people who ask for one! Try `IASKEDFORXP`!");
			break;
	}
}