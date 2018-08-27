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
    processMessage: function (message, tokens, timeOut) {
        var i18n = this.i18n;
        var removeFunction = this.deleteMessage;
        var deleteFunction = this.checkAndDeleteElement;
        
            try {
                this.https.get("https://status.mojang.com/check", res => {
                    let status = "";
                    res.setEncoding("utf8");
                    res.on("data", data => {
                        status += data;
                    });
                    res.on("end", () => {
                        try {
                            status = JSON.parse(status);
                        }
                        catch (error) {
                            removeFunction(message.channel.send(i18n.__mf(messages.error)), timeOut, deleteFunction);
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
                            if (formattedStatus[key] == "yellow") errors.push(i18n.__mf(messages.serviceIssue, {service: key}));
                            else if (formattedStatus[key] == "red") errors.push(i18n.__mf(messages.serviceDown, {service: key}));
                        }
                        if (errors.length == 0) removeFunction(message.channel.send(i18n.__mf(messages.ok)), timeOut, deleteFunction);
                        else removeFunction(message.channel.send(i18n.mf(messages.issues, {errors: errors.join("\n")})), timeOut, deleteFunction);
                    });
                });
            } catch (error) {
                removeFunction(message.channel.send(i18n.__mf(messages.error)), timeOut);
            } 
    }
});
