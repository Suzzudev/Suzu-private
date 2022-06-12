//import schema files
const guildSetup = require('../../schema/guild');
const inDb = require('../../indb');

module.exports = {
    name: 'transfer',
    description: 'transfer money to a user. (Absolute value)',
    options: [
        {
            name: 'user',
            description: 'The user to give money to.',
            type: 'USER',
            required: true
        },
        {
            name: 'amount',
            description: 'The amount of money to give.',
            type: 'NUMBER',
            required: true
        }
    ],

    async run(client, interaction) {

        //get the guild
        var response = await inDb.guild(interaction.guild.id);

        //if the guild doesn't exist, create it
        if (!response) {
            guildSetup.setup(interaction);
            return interaction.followUp(`Your guild wasn't in the database. We have added it for you, please rerun the command`);
        }

        //get the users
        var members = response.members;

        //for each member
        for (i = 0; i < members.length; i++) {
            //if the member doesn't have money, set it to 0
            if (members[i].money == undefined) members[i].money = 0;
            //if the member doesn't have bank, set it to 0
            if (members[i].bank == undefined) members[i].bank = 0;
            if(members[i].level == undefined) members[i].level = 1;
            if(members[i].xp == undefined) members[i].xp = 0;
            //update the guild
            guildSetup.update(interaction, members);
        }

        //get the user
        var user = interaction.options.getUser('user');
        var paid = false;

        //for each member
        for (i = 0; i < members.length; i++) {
            if (members[i].id == interaction.user.id) {
                //get the amount
                var amount = interaction.options.getNumber('amount');
                amount = Math.abs(amount);
                //if the member has enough money
                if (members[i].money >= amount) {
                    //subtract the amount from the member
                    members[i].money = members[i].money - amount;

                    console.log(members[i].money);

                    //update the guild
                    //send the message

                    interaction.followUp(`You have transferred $${amount} to ${user.username}`);

                    paid = true;
                    //break out of the loop
                    
                    guildSetup.update(interaction, members);
                    break;
                }
                //if the member doesn't have enough money
                else {
                    //send the message
                    interaction.followUp(`You don't have enough money to give ${user.username} $${Math.abs(amount)}`);
                    //break out of the loop
                    break
                }
            }

        }

        for (i = 0; i < members.length; i++) {
            if (!paid) return;
            //if the member is the user
            if (members[i].id == user.id) {
                //add the amount to the member
                members[i].money = members[i].money + amount;

                console.log(members[i].money);
            }
        }

        
        return guildSetup.update(interaction, members);
    }
}
