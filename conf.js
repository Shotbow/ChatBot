module.exports = {
	commands:
	{
		'commands': require('./commands/commands').commands,
		'rules': require('./commands/rules').rules,
		'banned': require('./commands/banned').banned,
		'report': require('./commands/report').report,
		'staff': require('./commands/staff').staff,
		'social': require('./commands/social').social,
		'stuck': require('./commands/stuck').stuck,
		'about': require('./commands/about').about,
		'bug': require('./commands/bug').bug,
		'ts': require('./commands/ts').ts,
		'ip': require('./commands/ip').ip,
		'vote': require('./commands/vote').vote,
		'mcstatus': require('./commands/mcstatus').mcstatus,
		'radio': require('./commands/radio').radio,
		'why': require('./commands/why').why,
		'contact': require('./commands/contact').contact
	},
	aliases:
	{
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
	},
	hiddenCommands:
	{
		'fry': require('./commands/fry').fry,
		'xp': require('./commands/xp').xp
	}
}