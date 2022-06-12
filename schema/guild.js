const mongoose = require('mongoose');

const client = require('../index.js');

const guildSchema = require('./guild-schema');

module.exports = {
    setup : async function setupGuild (interaction) {
        const guild = client.guilds.cache.get(interaction.guild.id);

        const users = await guild.members.fetch();

        const memberIds = users.map(user => user.id);

        const members = [];

        for( i = 0; i < memberIds.length; i++) {
            members.push(
                {
                    id: memberIds[i],
                    warnings: 0,
                    items : []
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
        const guildModel = new guildSchema(guildData).save();
    },

    reload : async function updateGuild (interaction, client) {
        const guild = client.guilds.cache.get(interaction.guild.id);

        const users = await guild.members.fetch();

        const memberIds = users.map(user => user.id);

        response = await guildSchema.findOne({guildID: interaction.guild.id});

        var user = response.members;

        const memberList = [];

        for( i = 0; i < memberIds.length; i++) {
            var member = user.find(member => member.id == memberIds[i]);

            if(!member) { 
                memberList.push(
                    {
                        id: memberIds[i],
                        warnings: 0,
                        items: [],
                        money : 0,
                        level : 1,
                        xp : 0,
                        bank : 0,
                        dailyDice : 3
                    }
                )
            }
            else {
                memberList.push({
                    id :  member.id,
                    warnings : member.warnings,
                    items : member.items,
                    money : member.money,
                    level: member.level,
                    xp: member.xp,
                    bank: member.bank,
                    dailyDice: member.dailyDice
                });
            }

        }

        const final = await guildSchema.findOneAndUpdate({
            guildID: interaction.guild.id
        }, {
            guildID: interaction.guild.id,
            members : memberList
        })
    },

    update : async function reloadGuild (interaction, members) {
        
        const response = await guildSchema.findOneAndUpdate(
            {
                guildID: interaction.guild.id
            },
            {
                guildID: interaction.guild.id,
                members : members
            }
        )
    }
}