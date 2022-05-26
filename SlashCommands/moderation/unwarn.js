const { MessageEmbed } = require('discord.js');
const inDb = require('../../indb');
const guildSetup = require('../../schema/guild');

module.exports = { 
    name : "unwarn",
    description : "Unwarns a user",
    category : "moderation",
    options : [
        {
            name : "user",
            description : "The user to unwarn",
            type : "USER",
            required : true
        }
    ],

    run : async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const guild = client.guilds.cache.get(interaction.guild.id);

        const response = await inDb.guild(interaction.guild.id);

        if(!(interaction.user.permissions.has(Permissions.FLAGS.MANAGE_ROLES && Permissions.FLAGS.KICK_MEMBERS && Permissions.FLAGS.BAN_MEMBERS))) {
            return interaction.followUp("You do not have permission to reset warnings, and if you are a moderator, get the owner to give you these permissions : The reverse of warn, you can't unwarn someone if you don't have the permissions to warn them.");
        }

        if(!response) {
            interaction.followUp("The database is not setup for this server, setting it up now, and no members have any warnings");
            return guildSetup.setup(interaction, false);
        }

        const members = response.members;

        for(i = 0; i < members.length; i++) {
            if(response.members[i].id == user.id) {
                if(members[i].warnings == 0) {
                    interaction.followUp("They don't have any warnings");
                    return;
                }
                members[i].warnings = members[i].warnings - 1;
                interaction.followUp(`${user.username} now has ${members[i].warnings} warnings`);
                break;
            }
        }

        guildSetup.update(interaction, members);
    }
}