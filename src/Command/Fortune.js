const Command = require( '../Command' );

module.exports = Command.extend ( {
    commandName: 'fortune',
    processMessage: function ( message, tokens ) {
		var arr = this.i18n.__mf( "fortunes" ).split( "\n" );
		message.channel.send( '`' + arr[ Math.floor( Math.random() * arr.length ) ] + '`' );
    }
});