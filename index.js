const Discord = require('discord.js');
const fs = require('fs');
const i18n = require('i18n');
const client = new Discord.Client();
const moment = require('moment-timezone');
const config = require('config');
client.setMaxListeners(0);

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

client.login(config.token);
