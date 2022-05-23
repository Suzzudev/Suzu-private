const { MessageEmbed } = require('discord.js');
const discord = require('discord.js');

module.exports = {
    name : "info",
    description : "Sends info on the bot",
    run : async (client, interaction) => {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Suzu')
            .addField('Creator', 'PuppyNuff')
            .addField('Version', '1.1.0')
            .addField('Prefix', '.')
            .addField('github', 'https://github.com/puppynuff/Suzu')
            .addField('Discord', 'https://discord.gg/UAHf7bAX')
            .setFooter(`Currently in ${client.guilds.cache.size} guilds`);
        interaction.followUp({embeds : [embed]});
    }
}