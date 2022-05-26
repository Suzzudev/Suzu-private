const { MessageEmbed } = require('discord.js');

module.exports = {
    name : "mute",
    description : "Mutes a user",
    options : [
        {
            name : "target",
            description : "The user to mute",
            type : "USER",
            required : true,
        },
        {
            name : "logchannel",
            description : "The channel to log the mute in",
            type : "CHANNEL",
            required : true,
        },
        {
            name : "muterole",
            description : "The role to mute the user with",
            type : "ROLE",
            required : true,
        },
        {
            name : "reason",
            description : "The reason for the mute",
            type : "STRING",
            required : false,
        },
    ],

    run : async (client, interaction) => {
        const target = interaction.options.getUser('target');
        var reason = interaction.options.getString('reason');
        const muteRole = interaction.options.getRole('muteRole');
        const logChannel = interaction.options.getChannel('logChannel');

        if(!interaction.user.permissions.has("MANAGE_ROLES")) {
            interaction.followUp("You do not have permission to mute members");
            return;
        }

        if(user.id === interaction.user.id) {
            return interaction.followUp("You cannot mute yourself");
        }
        
        if(!reason) {
            reason = "No reason specified";
        }

        if(target.roles.cache.has(muteRole)) {
            return interaction.followUp(`${target.tag} is already muted`);
        }

        target.roles.add(muteRole);

        interaction.followUp(`${target.tag} has been muted`);

        let embed = new MessageEmbed ()
            .setTitle(`Muted ${target.tag}`)
            .setDescription(`${target.tag} has been muted by ${interaction.member.tag} for ${reason}`)
            .setColor("#ff0000")
            .setThumbnail(target.displayAvatarURL())
            .setFooter(`Muted by ${interaction.member.tag}`);

        if(logChannel) {
            logChannel.send(embed);
        }
    }

}