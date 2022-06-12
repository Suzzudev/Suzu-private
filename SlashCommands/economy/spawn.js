//Schema files
const inDb = require('../../indb.js');
const guild = require('../../schema/guild');
const { Permissions } = require('discord.js');

const items = [
    {
        name : 'bank upgrade',
        price: 1000000
    },
    {
        name: 'pad lock',
        price: 100000
    }
]

module.exports = {
    name: "spawn",
    description: "Spawns money / items in a users bank / storage",
    options : [
        {
            name: "user",
            description: "The user to spawn money / items for",
            type: "USER",
            required: true
        },
        {
            name: "type",
            description: "Whether to spawn money or items",
            type: "STRING",
            required: true,
            values: ["money", "item"]
        },
        {
            name: "amount",
            description: "The amount of money / items to spawn",
            type: "NUMBER",
            required: false
        },
        {
            name: "item",
            description: "The item to spawn",
            type: "STRING",
            required: false
        }
    ],

    run : async function(client, interaction) {
        const user = interaction.options.getUser("user");
        const type = interaction.options.getString("type");
        const amount = interaction.options.getNumber("amount");
        const item = interaction.options.getString("item");

        var userItems = [];

        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            interaction.followUp("You do not have permission to reset warnings");
            return;
        }

        if(type == "money") {
            if(amount == null) {
                interaction.followUp("You must specify an amount of money to spawn!");
                return;
            }
        }

        if(type == "item") {
            if(item == null) {
                interaction.followUp("You must specify the item to spawn!");
                return;
            }
        }

        const response = await inDb.guild(interaction.guild.id);

        if(!response) {
            interaction.followUp("Your guild is not set up yet! We'll set it up for you");
            guild.setup(interaction);
            return;
        }

        var members = response.members;

        for(i = 0; i < members.length; i++) {
            if(members[i].money == undefined) members[i].money = 0;
            if(members[i].bank == undefined) members[i].bank = 0;
            if(members[i].level == undefined) members[i].level = 1;
            if(members[i].xp == undefined) members[i].xp = 0;
            guildSetup.update(interaction, members);
        }


        for (i = 0; i < members.length; i++) {
            if(members[i].id == user.id) {
                if(type == "money") {
                    members[i].money += amount;
                }

                if(type == "item") {
                    for(j = 0; j < items.length; j++) {
                        if(!items[j].name == item) continue;

                        userItems = members[i].items;
                        if(!userItems) userItems = [{name : items[j].name}];
                        else
                        userItems.push({
                            name : items[j].name
                        });

                        members[i].items = userItems;

                        interaction.followUp(`You have spawned ${items[j].name} for ${user.username}`);
                    }
                }
            }
        }

        guildSetup.update(interaction, members);
    }
}