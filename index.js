const Discord = require('discord.js');
const fs = require('fs');
const i18n = require('i18n');
const client = new Discord.Client();
const moment = require('moment-timezone');
const config = require('config');
client.setMaxListeners(0);

const RoleDeterminer = require('./src/Helper/RoleDeterminer');
const commandList = new (require('./src/CommandContainer'));
const cache = new (require('./src/Cache'));
const dependencyGraph = {
    'Discord': Discord,
    'discordClient': client,
    'commandPrefix': '!',
    'commandList': commandList,
    'https': require('https'),
    'Date': Date,
    'JSON': JSON,
    'Cache': cache,
    'child_process': require('child_process'),
    'fs': fs,
    'i18n': i18n,
    'moment': moment,
    'config': config
};
cache.initialize(dependencyGraph);

i18n.configure({
    locales: config.languages.locales,
    directory: __dirname + '/locales',
    defaultLocale: config.languages.default,
    autoReload: true,
    updateFiles: true,
});

const commandFiles = fs.readdirSync('./src/Command');
for (const key in commandFiles) {
    if (!commandFiles.hasOwnProperty(key)) continue;
    const file = commandFiles[key];

    const command = new (require(`./src/Command/${file}`));
    command.initialize(dependencyGraph);

    /* Add to the command container */
    commandList.add(command.commandName, command);
    command.commandAliases.forEach(alias => commandList.add(alias, command));
}

const utilityFiles = fs.readdirSync('./src/Utility');
for (const key in utilityFiles) {
    if (!utilityFiles.hasOwnProperty(key)) continue;
    const file = utilityFiles[key];

    let utility = new (require(`./src/Utility/${file}`));
    utility.initialize(dependencyGraph);
}

/* Main command interceptor */
client.on('message', (message) => {
    /* If the member is muted, we won't execute their commands */
    if (message.member && RoleDeterminer.isMuted(message.member)) {
        return;
    }

    /* Retrieve command and tokens */
    let messageText = message.content;
    if (messageText.substr(0, dependencyGraph.commandPrefix.length) !== dependencyGraph.commandPrefix) return;
    let tokens = messageText.split(' ');
    let commandName = tokens[0].substr(dependencyGraph.commandPrefix.length).toLowerCase();

    /* Get the command executor for the provided command and execute the command */
    const command = commandList.get(commandName);
    if (command) {
        command.execute(message, tokens);
    }
});

client.on('ready', () => {
    client.user.setActivity("on Shotbow");
    console.log("Successfully logged in!");
});

client.login(process.env.TOKEN ? process.env.TOKEN : config.token);
