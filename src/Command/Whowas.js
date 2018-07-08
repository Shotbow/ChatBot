const Command = require('../Command');

const uuidRegEx = RegExp('^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$', 'i');
const mcidRegEx = RegExp('^[a-z\\d_]{3,16}$', 'i');
const messages = {
    error: "Uh oh, there seems to be an error retrieving data from the Mojang API with that input. Verify your input or try again later!",
    invalid: "It seems like you haven't provided a valid username or UUID. Please verify your input.",
    names: "I have retrieved the following information about `{input}`:\n{names}",
    originalName: "- {name} (original)",
    changedName: "- {name} (changed to at {date})"
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
        let identifier = tokens[1];

        if (mcidRegEx.test(identifier)) {
            this.fetchData(`https://api.mojang.com/users/profiles/minecraft/${identifier}`, (res) => {
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

                    message.channel.send(i18n.__mf(messages.names, { input: tokens[1], names: this.processNames(res) }));
                });
            });
        } else if (uuidRegEx.test(identifier)) {
            identifier = identifier.replace('-', ''); // Remove any dashes from the UUID

            this.fetchData(`https://api.mojang.com/user/profiles/${identifier}/names`, (res) => {
                if (res === false) {
                    message.channel.send(i18n.__mf(messages.error));
                    return;
                }

                message.channel.send(i18n.__mf(messages.names, { input: tokens[1], names: this.processNames(res) }));
            });
        } else {
            message.channel.send(i18n.__mf(messages.invalid));
        }
    },
    processNames: function(names) {
        let nameHistory = [];
        names.map(entry => {
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
                if (res.statusCode != 200) {
                    callback(false);
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
