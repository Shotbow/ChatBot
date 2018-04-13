const Discord = require('discord.js');
const tokens = require("./token");
const instantiateCommands = require("./instantiateCommands");
const instantiateUtilities = require("./instantiateUtilities");
const client = new Discord.Client();
client.setMaxListeners(0);

const commandList = new (require('./src/CommandContainer'));
const dependencyGraph = {
    'discordClient': client,
    'commandPrefix': '!',
    'commandList': commandList,
    'https': require('https')
};
for (let key in instantiateCommands) {
    if (!instantiateCommands.hasOwnProperty(key)) continue;
    let commandPath = './src/Command/' + instantiateCommands[key];
    let command = new (require(commandPath));
    command.initialize(dependencyGraph);

    commandList.add(key, command);
}

for (let key in instantiateUtilities) {
    if (!instantiateUtilities.hasOwnProperty(key)) continue;
    let utilityPath = './src/Utility/' + instantiateUtilities[key];
    let utility = new (require(utilityPath));
    utility.initialize(dependencyGraph);
}

process.stdin.resume();
const cleanupHandler = function() {
    client.user.setPresence({
        game: {
            name: 'on Shotbow',
            url: 'https://shotbow.net/',
        },
        afk: true,
        status: 'invisible',
    }).catch(reason => console.log(reason));
};

const exitHandler = function () {
    process.exit();
};

process.on('exit', cleanupHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

client.on('ready', () => {
    console.log("Successfully logged in!");
    client.user.setPresence({
        game: {
            name: 'on Shotbow',
            url: 'https://shotbow.net/',
        },
        afk: true,
        status: 'online'
    }).catch(reason => console.log(reason));
});

client.login(tokens.getToken());
