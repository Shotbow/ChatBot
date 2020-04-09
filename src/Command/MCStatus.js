const Command = require('../Command');

const messages = {
    error: "Uh oh, there seems to be an error with the Mojang API. Try again later!",
    serviceIssue: "- {service} is having some issues",
    serviceDown: "- {service} is completely down",
    ok: "I just checked Mojang's servers, and everything seems to be working fine!",
    issues: "I just checked Mojang's servers, and there appear to be some issues:\n",
};

module.exports = Command.extend({
    commandName: 'mcstatus',
    https: null,
    dependencies: {
        'https': 'https'
    },
    processMessage: async function (message, tokens) {
        return await this.fetchMojangStatus(message).then(resolve => {
            return resolve;
        }).catch(error => {
            return message.channel.send(this.i18n.__mf(messages.error));
        });
    },
    fetchMojangStatus: function(message) {
        return new Promise((resolve, reject) => {
            this.https.get("https://status.mojang.com/check", res => {
                let status = "";
                res.setEncoding("utf8");
                res.on("data", data => {
                    status += data;
                });
                res.on("end", () => {
                    try {
                        status = JSON.parse(status);
                    } catch (error) {
                        resolve(message.channel.send(this.i18n.__mf(messages.error)));
                        return;
                    }
                    let formattedStatus = {};
                    for (let i = 0; i < status.length; i++) {
                        for (let key in status[i]) {
                            formattedStatus[key] = status[i][key];
                        }
                    }
                    let errors = [];
                    for (let key in formattedStatus) {
                        if (formattedStatus[key] == "yellow") errors.push(this.i18n.__mf(messages.serviceIssue, {service: key}));
                        else if (formattedStatus[key] == "red") errors.push(this.i18n.__mf(messages.serviceDown, {service: key}));
                    }
                    if (errors.length == 0) resolve(message.channel.send(this.i18n.__mf(messages.ok)));
                    else resolve(message.channel.send(this.i18n.mf(messages.issues, {errors: errors.join("\n")})));
                });
            });
        });
    }
});
