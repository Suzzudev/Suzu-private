const { MessageEmbed } = require('discord.js');

module.exports = {
    name : "kick",
    description : "Kicks a user",
    options : [
        {
            name : "target",
            description : "The user to kick",
            type : "USER",
            required : true,
        },
        {
            name : "logchannel",
            description : "The channel to log the kick in",
            type : "CHANNEL",
            required : true,
        },
        {
            name : "reason",
            description : "The reason for the kick",
            type : "STRING",
            required : false,
        },
    ],

    run : async (client, interaction) => {
        const target = interaction.options.getUser('target');
        var reason = interaction.options.getString('reason');

        const logChannel = interaction.options.getChannel('logChannel');

        if(!interaction.user.permissions.has("KICK_MEMBERS")) {
            interaction.followUp("You do not have permission to kick members");
            return;
        }

        if(!target) {
            return interaction.followUp ("You must specify a user to kick");
        }

        if(!reason) {
            reason = "No reason specified";
        }

        let embed = new MessageEmbed ()
            .setTitle(`Kicked ${target.tag}`)
            .setDescription(`${target.tag} has been kicked by ${interaction.member.tag} for ${reason}`)
            .setColor("#ff0000")
            .setThumbnail(target.displayAvatarURL())
            .setFooter(`Kicked by ${interaction.member.tag}`);

        interaction.followUp(`${target.tag} has been kicked`);

        logChannel.send({embeds : [embed] });
        
        target.kick(reason);
    }

}