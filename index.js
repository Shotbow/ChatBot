const Discord = require('discord.js');
const tokens = require("./token");
const fs = require('fs');
const client = new Discord.Client();
client.setMaxListeners(0);

const commandList = new (require('./src/CommandContainer'));
const dependencyGraph = {
    'discordClient': client,
    'commandPrefix': '!',
    'commandList': commandList,
    'https': require('https'),
    'child_process': require('child_process'),
    'fs': fs
};
const commandFiles = fs.readdirSync('./src/Command');
for (const key in commandFiles) {
    if (!commandFiles.hasOwnProperty(key)) continue;
    const file = commandFiles[key];

    const command = new (require(`./src/Command/${file}`));
    command.initialize(dependencyGraph);
    commandList.add(key, command);
}

const utilityFiles = fs.readdirSync('./src/Utility');
for (const key in utilityFiles) {
    if (!utilityFiles.hasOwnProperty(key)) continue;
    const file = utilityFiles[key];

    let utility = new (require(`./src/Utility/${file}`));
    utility.initialize(dependencyGraph);
}

client.on('ready', () => {
    client.user.setActivity("on Shotbow");
    console.log("Successfully logged in!");
});

client.login(tokens.getToken());
