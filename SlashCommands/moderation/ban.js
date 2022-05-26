const { MessageEmbed } = require('discord.js');
const guildSchema = require('../../schema/guild-schema');
const inDb = require('../../indb');

module.exports = {
    name : "ban",
    description : "Bans a user",
    category : "moderation",
    options : [
        {
            name : "user",
            description : "The user to ban",
            type : "USER",
            required : true
        },
        {
            name : "reason",
            description : "The reason for the ban",
            type : "STRING",
            required : false
        },
        {
            name : "logchannel",
            description : "The channel to log the ban in",
            type : "CHANNEL",
            required : false
        }
    ],

    run : async (client, interaction) => {
        const user = interaction.options.getUser('user');
        var reason = interaction.options.getString('reason');
        var logChannel = interaction.options.getChannel('logchannel');
        if(!reason) {
            reason = "No reason given";
        }
        const target = interaction.guild.members.cache.get(user.id);

        target.ban();

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Ban')
            .addField('User', user.tag)
            .addField('Reason', reason)
            .setFooter(`Banned by ${interaction.user.tag}`);
        
        if(logChannel) {
            logChannel.send({embeds : [embed]});
        }

        interaction.followUp(`${user.tag} has been banned.`);
    }
}

const updateSchema = async (interaction, ban) => {
    guildSchema.findOneAndUpdate(
        {
            guildID : interaction.guild.id
        },
        {
            bans : ban
        }
    )
}