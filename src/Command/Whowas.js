const Command = require('../Command');

const uuidRegEx = RegExp('^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$', 'i');
const mcidRegEx = RegExp('^[a-z\\d_]{3,16}$', 'i');
const maxDisplayed = 10;
const moreInfoUrl = "https://namemc.com/search?q=";
const messages = {
    error: "Uh oh, there seems to be an error retrieving data from the Mojang API with that input. Verify your input or try again later!",
    invalid: "It seems like you haven't provided a valid username or UUID. Please verify your input.",
    names: "I have retrieved the following information about `{input}`:\n{names}\nSee full name history at {url}",
    originalName: "- `{name}` (original)",
    changedName: "- `{name}` (changed to at {date})",
    moreNames: "- ... {amount} entries hidden ...",
    usernameNotFound: "I could not find any players with that username.",
    uuidNotFound: "I could not find any players with that UUID.",
    incorrectUsage: "It looks like you did not provide a UUID or username. Please use `!whowas <UUID>` or `!whowas <username>`."
};

module.exports = Command.extend({
    commandName: 'whowas',
    https: null,
    moment: null,
    dependencies: {
        'https': 'https',
        'moment': 'moment'
    },
    processMessage: function (message, tokens) {
        let i18n = this.i18n;

        if (tokens.length < 2) {
            message.channel.send(i18n.__mf(messages.incorrectUsage));
            return;
        }

        let identifier = tokens[1];
        if (mcidRegEx.test(identifier)) {
            this.fetchData(`https://api.mojang.com/users/profiles/minecraft/${identifier}`, (res) => {
                if (res === null) {
                    message.channel.send(i18n.__mf(messages.usernameNotFound));
                    return;
                }

                if (res === false) {
                    message.channel.send(i18n.__mf(messages.error));
                    return;
                }

                identifier = res.id.replace('-', ''); // Remove any dashes from the UUID

                this.fetchData(`https://api.mojang.com/user/profiles/${identifier}/names`, (res) => {
                    if (res === false) {
                        message.channel.send(i18n.__mf(messages.error));
                        return;
                    }

                    message.channel.send(i18n.__mf(messages.names, { input: tokens[1], names: this.processNames(res, identifier), url: moreInfoUrl + identifier }));
                });
            });
        } else if (uuidRegEx.test(identifier)) {
            identifier = identifier.replace('-', ''); // Remove any dashes from the UUID

            this.fetchData(`https://api.mojang.com/user/profiles/${identifier}/names`, (res) => {
                if (res === null) {
                    message.channel.send(i18n.__mf(messages.uuidNotFound));
                    return;
                }

                if (res === false) {
                    message.channel.send(i18n.__mf(messages.error));
                    return;
                }

                message.channel.send(i18n.__mf(messages.names, { input: tokens[1], names: this.processNames(res, identifier), url: moreInfoUrl + identifier }));
            });
        } else {
            message.channel.send(i18n.__mf(messages.invalid));
        }
    },
    processNames: function(names) {
        let nameHistory = [];
        if (names.length > maxDisplayed) {
            nameHistory.push(this.i18n.__mf(messages.moreNames, { amount: names.length - maxDisplayed }));
        }
        names
            .splice(names.length - maxDisplayed)
            .map(entry => {
                if (entry.changedToAt) {
                    nameHistory.push(this.i18n.__mf(messages.changedName, { name: entry.name, date: this.moment(entry.changedToAt).format('ll') }));
                } else {
                    nameHistory.push(this.i18n.__mf(messages.originalName, { name: entry.name }));
                }
        });

        return nameHistory.join('\n');
    },
    fetchData: function(url, callback) {
        try {
            this.https.get(url, res => {
                // We need to check if the status is 200, due to Mojang enforcing proper HTTP status codes
                // In the case of success without content, 204 NO CONTENT is sent, which https accepts as success
                if (res.statusCode !== 200) {
                    callback(null);
                    return;
                }

                let responseData = '';
                res.on('data', data => {
                    responseData += data;
                });
                res.on('end', () => {
                    try {
                        responseData = JSON.parse(responseData);
                    } catch (error) {
                        callback(false);
                    }
                    callback(responseData);
                });
                res.on('error', () => {
                    callback(false);
                });
            });
        } catch (error) {
            callback(false);
        }
    }
});
