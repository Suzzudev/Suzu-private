const client = require("../../index.js");

module.exports = {
    name : 'anonymousvent',
    description : 'Sends the vent message anonymously to the vent channel',
    category: 'help-commands',
    options : [
        {
            name : 'message',
            description : 'The message to send',
            type : 'STRING',
            required : true,
        },
        {
            name : 'log',
            description : 'Whether or not to log the message (pm to you)',
            type : 'BOOLEAN',
            required : false,
        }
    ],

    run : async (client, interaction) => {
        const message = interaction.options.getString('message');
        const log = interaction.options.getBoolean('log');

        const ventChannel = interaction.guild.channels.cache.find(channel => channel.name === "vent");

        if (!ventChannel) {
            interaction.reply('The vent channel does not exist');
            return;
        }

        if( log === true && log != null) {
            interaction.user.send(message);
        }

        ventChannel.send(message);

        await interaction.channel.bulkDelete(1);
    }

}