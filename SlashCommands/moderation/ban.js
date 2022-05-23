const { MessageEmbed } = require('discord.js');

module.exports = {
    name : "ban",
    description : "Bans a user",

    options : [
        {
            name : "user",
            description : "The user to ban",
            type : "USER",
            required : true,
        },
        {
            name : "logchannel",
            description : "The channel to log the ban in",
            type : "CHANNEL",
            required : true,
        },
        {
            name : "reason",
            description : "The reason for the ban",
            type : "STRING",
            required : false,
        },
    ],
    run : async (client, interaction) => {
        const target = interaction.options.getUser('user');
        var reason = interaction.options.getString('reason');

        const logChannel = interaction.options.getChannel('logChannel');

        if(!interaction.user.permissions.has("BAN_MEMBERS")) {
            interaction.followUp("You do not have permission to ban members");
            return;
        }

        if(!target) {
            return interaction.followUp ("You must specify a user to ban");
        }

        if(!reason) {
            reason = "No reason specified";
        }

        let embed = new MessageEmbed ()
            .setTitle(`Banned ${target.tag}`)
            .setDescription(`${target.tag} has been banned by ${interaction.member.tag} for ${reason}`)
            .setColor("#ff0000")
            .setThumbnail(target.displayAvatarURL())
            .setFooter(`Banned by ${interaction.member.tag}`);

        interaction.followUp(`${target.tag} has been banned`);

        logChannel.send({embeds : [embed] });
        
        target.ban(reason);
    }   
}