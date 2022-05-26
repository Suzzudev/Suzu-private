const inDb = require('../../indb.js');
const guild = require('../../schema/guild.js');
const updateSchema = require('../../schema/update-schema');
const { Permissions } = require('discord.js');
module.exports = {
    name : "resetwarnings",
    description : "Resets the warnings of a user",
    options : [
        {
            name : "target",
            description : "The user to reset the warnings of",
            type : "USER",
            required : true,
        },
    ],

    run : async (client, interaction) => {
        const target = interaction.options.getUser('target');
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            interaction.followUp("You do not have permission to reset warnings");
            return;
        }

        if(target.id === interaction.user.id) {
            return interaction.followUp("You cannot reset your warnings");
        }

        const response = await inDb.guild(interaction.guild.id);

        if(!response) {
            interaction.followUp("The database is not setup for this server, setting it up now, and no members have any warnings");
            return guild.setup(interaction, false);
        }

        var members = response.members;

        
        var found = false;

        for ( i = 0; i < members.length; i++) {
            if(members[i].id == target.id) {
                members[i].warnings = 0;
                found = true;
                console.log('Found them!')
                break;
            }
        }

        if(!found) {
            interaction.followUp("They don't exist? \nReloading the database, then try again");
            Guild.reload(interaction, client);
            return;
        } else {
            interaction.followUp("Warnings reset for " + target.username);
        }
        
        updateSchema.guild(interaction.guild.id, members);
    }
}