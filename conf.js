module.exports = {
	commands:
	{
		'commands': require('./commands/commands'),
		'rules': require('./commands/rules'),
		'banned': require('./commands/banned'),
		'report': require('./commands/report'),
		'staff': require('./commands/staff'),
		'social': require('./commands/social'),
		'stuck': require('./commands/stuck'),
		'about': require('./commands/about'),
		'bug': require('./commands/bug'),
		'ts': require('./commands/ts'),
		'ip': require('./commands/ip'),
		'vote': require('./commands/vote'),
		'mcstatus': require('./commands/mcstatus'),
		'radio': require('./commands/radio'),
		'why': require('./commands/why'),
		'contact': require('./commands/contact')
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
		'fry': require('./commands/fry'),
		'xp': require('./commands/xp')
	}
}