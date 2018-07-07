const Command = require('../Command');

module.exports = Command.extend({
	commandName: 'mute',
	commandAliases: ['ban'],
	advertisable: false,
	processMessage: function (message, tokens) {
		let hasRoles = message.member !== null && typeof message.member.roles !== 'undefined';

		if (hasRoles && this.memberIsAdministrator(message.member)) {
			message.delete();

			let victim = message.mentions.members.first();

			if (tokens.length < 3 || !victim) {
				message.member.user.send('Please use the correct format: `' + tokens[0] + ' <@User#9999> <Reason>`.');
			}
			else {
				let reason = tokens.slice(2).join(' ');

				if (!reason || reason == '' || reason == null) {
					message.member.user.send('Please use the correct format: `' + tokens[0] + ' <@User#9999> <Reason>`.');
				} else {
					message.member.user.send({
						embed: {
							color: 0xff0000,
							author: {
								name: this.discordClient.user.username,
								icon_url: this.discordClient.user.avatarURL
							},
							title: "Successfully muted " + victim.user.username,
							fields: [
							{
								name: "Mute Reason",
								value: reason
							}
							],
							timestamp: new Date(),
							footer: {
								icon_url: this.discordClient.user.avatarURL,
								text: "Shotbow Network Chat Bot"
							}
						}
					});

					victim.user.send({
						embed: {
							color: 0xff0000,
							author: {
								name: this.discordClient.user.username,
								icon_url: this.discordClient.user.avatarURL
							},
							title: "You have been muted on the Shotbow Discord",
							fields: [
							{
								name: "Mute Reason",
								value: reason
							},
							{
								name: "Appeal",
								value: "You can appeal by going to [this link](https://shotbow.net/forum/forums/ban-appeals.22/) on our Shotbow forums."
							}
							],
							timestamp: new Date(),
							footer: {
								icon_url: this.discordClient.user.avatarURL,
								text: "Shotbow Network Chat Bot"
							}
						}
					})
						.then(() => {
							victim.addRole(message.guild.roles.find('name', 'Muted'))
								.catch(error => message.member.user.send('In addition, I was unable to grant them the `Muted` role for some reason. My permissions may be messed up. Please contact a developer immediately.\n**Error: ** ```' + error + '```'));
						})
						.catch(error => message.member.user.send('In addition, I was unable to DM the banned user about their ban. It is likely that they have DMs disabled.'));
				}
			}
		}
	},
	memberIsAdministrator: function (member) {
		for (let role in this.config.administrator_roles) {
			if (member.roles.has(this.config.administrator_roles[role])) {
				return true;
			}
		}
		return false;
	}
});
