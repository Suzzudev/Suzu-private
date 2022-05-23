const mongoose = require('mongoose');

const client = require('../index.js');

const guildSchema = require('./guild-schema');

module.exports = {
    setup : async function setupGuild (interaction, welcome) {
        const guild = client.guilds.cache.get(interaction.guild.id);

        const users = await guild.members.fetch();

        const memberIds = users.map(user => user.id);

        const members = [];

        for( i = 0; i < memberIds.length; i++) {
            members.push(
                {
                    id: memberIds[i],
                    warnings: 0
                }
            )

            console.log(memberIds[i]);
        }

        const guildData = {
            guildID: guild.id,
            members : members,
            firstWarning : "3",
            finalWarning : "5",
            firstWarningPunishment : "kick",
            secondWarningPunishment : "kick"
        }

        if(!welcome) {
            interaction.channel.send("Until you set up a mute role with /guild-config, users will be kicked. You can also change this to ban or keep it as kick with /guild-config");
        }
        const guildModel = new guildSchema(guildData).save();
    },

    update : async function updateGuild (interaction, client) {
        const guild = client.guilds.cache.get(interaction.guild.id);

        const users = await guild.members.fetch();

        const memberIds = users.map(user => user.id);

        response = await guildSchema.findOne({guildID: interaction.guild.id});

        var user = response.members;

        const memberList = [];

        for( i = 0; i < memberIds.length; i++) {
            const member = user.find(member => member.id == memberIds[i]);

            if(!member) { 
                memberList.push(
                    {
                        id: memberIds[i],
                        warnings: 0
                    }
                )
            }
            else {
                memberList.push({
                    id :  member.id,
                    warnings : member.warnings
                });
            }

        }

        const final = await guildSchema.findOneAndUpdate({
            guildID: interaction.guild.id
        }, {
            guildID: interaction.guild.id,
            members : memberList
        })
    }
}