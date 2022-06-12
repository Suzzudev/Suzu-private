const inDb = require('../../indb.js');
const guildSetup = require('../../schema/guild');

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
    name: 'buy',
    description: 'Buy an item from the shop.',
    options : [
        {
            name: 'item',
            description: 'The item to buy.',
            type: 'STRING',
            required: true
        }
    ],

    async run(client, interaction) {
        var response = await inDb.guild(interaction.guild.id);

        if(!response) {
            guildSetup.setup(interaction);
            return interaction.followUp(`Your guild wasn't in the database. We have added it for you, please rerun the command`);
        }

        var found = false;
        var itemFound = false;
        var members = response.members;

        for(i = 0; i < members.length; i++) {
            if(members[i].money == undefined) members[i].money = 0;
            if(members[i].bank == undefined) members[i].bank = 0;
            if(members[i].level == undefined) members[i].level = 1;
            if(members[i].xp == undefined) members[i].xp = 0;
            guildSetup.update(interaction, members);
        }


        for(i = 0; i < members.length; i++) {
            if(response.members[i].id == interaction.user.id) {
                found = true;

                var item = interaction.options.getString('item');
                for(j = 0; j < items.length; j++) {
                    if(items[j].name != item) continue;

                    console.log(items[j].name);

                    console.log(members[i].items);
                    
                    if(members[i].items = undefined) members[i].items = [];

                    if(members[i].money < items[j].price){
                        interaction.followUp(`You have ${members[i].money} and you need ${items[j].price} to buy ${items[j].name}`); 
                        continue;
                    }

                    if(!members[i].items) userItems = [{name : items[j].name}];
                    else
                    userItems = members[i].items;
                     userItems.push({
                        name : items[j].name
                    });

                    console.log(userItems);

                    members[i].items = userItems;

                    members[i].money -= items[j].price;

                    guildSetup.update(interaction, members);

                    interaction.followUp(`You have bought ${items[j].name} for ${items[j].price}`);

                    itemFound = true;

                }
            }
        }

        if(!found) {
            guildSetup.update(interaction, response.members);
            return interaction.followUp(`You weren't found in the guilds database. Reloading the users, please rerun the command `);
        }

        if(!itemFound) {
            interaction.followUp(`That item is not in the shop!`);
        }
    }
}