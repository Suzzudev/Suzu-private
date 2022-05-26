const inDb = require('../../indb.js');
const guildSetup = require('../../schema/guild.js');
const updateSchema = require('../../schema/update-schema');
const { Permissions } = require('discord.js');
const guild = require('../../schema/guild');

module.exports = {
    name : "warn",
    description : "Gives the user a warning",
    options : [
        {
            name : "target",
            description : "The user to add a warning to",
            type : "USER",
            required : true,
        },
    ],

    run : async (client, interaction) => {
        const target = interaction.options.getUser('target');
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES && Permissions.FLAGS.KICK_MEMBERS && Permissions.FLAGS.BAN_MEMBERS)) {
            interaction.followUp("You do not have permission to reset warnings, and if you are a moderator, get the owner to give you these permissions : \nManage Roles (For muting members)\nKick Members (For kicking members)\nBan Members (For banning members)\n Reason : The punishments go between those three.");
            return;
        }

        if(target.id === interaction.user.id) {
            return interaction.followUp("You cannot reset your warnings");
        }

        const response = await inDb.guild(interaction.guild.id);

        if(!response) {
            interaction.followUp("The database is not setup for this server, setting it up now, and no members have any warnings");
            return guildSetup.setup(interaction, false);
        }

        var members = response.members;

        
        var found = false;

        var warningAmount = 0;

        for ( i = 0; i < members.length; i++) {
            if(members[i].id == target.id) {
                members[i].warnings = members[i].warnings + 1;
                warningAmount = members[i].warnings;
                found = true;
                console.log('Found them!')
                break;
            }
        }

        if(!found) {
            interaction.followUp("They don't exist? \nReloading the database, then try again");
            guild.reload(interaction, client);
            return;
        }

        if(warningAmount >= response.firstWarning && warningAmount < response.finalWarning) {
            if(response.firstWarningPunishment == "kick") {
                const user = interaction.guild.members.cache.get(target.id);
                user.kick();
                guild.reload(interaction, client);
                interaction.followUp(`You might want to run the /reloadguild command to reload the members list`);
            } else if(response.firstWarningPunishment == "ban") {
                const user = interaction.guild.members.cache.get(target.id);
                user.ban();
                guild.reload(interaction, client);
                interaction.followUp(`You might want to run the /reloadguild command to reload the members list`);
            } else if(response.firstWarningPunishment == "mute") {
                if(!response.muteRole) {
                    interaction.followUp("The guild has not been setup to have a mute role");
                    interaction.followUp(`${target.username} now has ${warningAmount} warnings`);
                    return;
                }
                const role = interaction.guild.roles.cache.get(response.muteRole);
                if(!role) {
                    interaction.followUp("The guild has not been setup to have a mute role");
                    return;
                }
                const user = interaction.guild.members.cache.get(target.id);
                user.roles.add(role);
                interaction.followUp(`${target.username} is now muted`);
            }
        }else if(warningAmount >= response.finalWarning) {
            if(response.secondWarningPunishment == "kick") {
                const user = interaction.guild.members.cache.get(target.id);
                user.kick();
                guild.reload(interaction, client);
                interaction.followUp(`You might want to run the /reloadguild command to reload the members list`);
            } else if(response.secondWarningPunishment == "ban") {
                const user = interaction.guild.members.cache.get(target.id);
                user.ban();
                guild.reload(interaction, client);
                interaction.followUp(`You might want to run the /reloadguild command to reload the members list`);
            } else if(response.secondWarningPunishment == "mute") {
                if(!response.muteRole) {
                    interaction.followUp("The guild has not been setup to have a mute role");
                    interaction.followUp(`${target.username} now has ${warningAmount} warnings`);
                    return;
                }
                const role = interaction.guild.roles.cache.get(response.muteRole);
                if(!role) {
                    interaction.followUp("The guild has not been setup to have a mute role");
                    return;
                }
                const user = interaction.guild.members.cache.get(target.id);
                user.roles.add(role);
                interaction.followUp(`${target.username} is now muted`);
            }
        } else {
            interaction.followUp(`${target.username} now has ${warningAmount} warnings`);
        }
        
        updateSchema.guild(interaction.guild.id, members);
    }
}