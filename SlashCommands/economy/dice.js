//import schema files
const guildSetup = require('../../schema/guild');
const inDb = require('../../indb');

module.exports = {
    name: 'dice',
    description: 'Roll dice for money.',
    options: [
        {
            name: 'amount',
            description: 'The amount to bet on the dice.',
            type: 'INTEGER',
            required: true
        }
    ],

    async run(client, interaction) {
        var response = await inDb.guild(interaction.guild.id);

        if (!response) {
            guildSetup.setup(interaction);
            return interaction.followUp(`Your guild wasn't in the database. We have added it for you, please rerun the command`);
        }

        var members = response.members;

        for (i = 0; i < members.length; i++) {
            if (members[i].money == undefined) members[i].money = 0;
            if (members[i].bank == undefined) members[i].bank = 0;
            if (members[i].level == undefined) members[i].level = 1;
            if (members[i].xp == undefined) members[i].xp = 0;
            if (members[i].dailyDice == undefined) members[i].dailyDice = 3;
            if (members[i].diceTime == undefined) members[i].diceTime = 0;

            if (members[i].id == interaction.user.id) {

                if (members[i].dailyDice == undefined) members[i].dailyDice = 3;
                if (members[i].dailyDice <= 0) {
                    interaction.followUp(`You have used all your daily dice.`);

                    const now = Date.now();

                    if (now - members[i].diceTime < 1000 * 60 * 60 * 24) {
                        interaction.channel.send(`You can only roll the dice once every 24 hours.`);
                        console.log("works :)");
                        continue;
                    } else {
                        members[i].dailyDice = 3;
                        members[i].diceTime = 0;
                        this.run(client, interaction);
                    }
                    continue;
                }
                //random number 1 - 6 twice
                var dice1 = Math.floor(Math.random() * 6) + 1;
                var dice2 = Math.floor(Math.random() * 6) + 1;
                var amount = interaction.options.getInteger('amount');

                if (members[i].money < amount) {
                    interaction.followUp(`You don't have enough money to bet ${amount}`);
                    continue;
                }

                
                interaction.channel.send(`You now have ${members[i].dailyDice - 1} dice left.`);
                members[i].dailyDice -= 1;

                if(members[i].dailyDice == 0) {
                    members[i].diceTime = Date.now();
                }

                //rng based on dice roll
                if (dice1 == dice2) {
                    members[i].money += amount * 10;
                    interaction.followUp(`You rolled a double!. You won $${separator(amount * 10)}!`);
                    continue;
                }

                if (dice1 + dice2 <= 5) {
                    members[i].money - + amount * 0.5;
                    interaction.followUp(`You rolled ${dice1} and ${dice2}. You lost $${separator(amount * 0.5)}!`);
                    continue;
                }

                if (dice1 + dice2 < 8 && dice1 + dice2 >= 5) {
                    interaction.followUp(`You rolled ${dice1} and ${dice2}. You ended in a stalemate.`);
                    continue;
                }

                if (dice1 + dice2 < 11 && dice1 + dice2 >= 8) {
                    members[i].money += amount * 2;
                    interaction.followUp(`You rolled ${dice1} and ${dice2}. You won $${separator(amount * 2)}!`);
                    continue;
                }

                if (dice1 + dice2 >= 11) {
                    members[i].money += amount * 3;
                    interaction.followUp(`You rolled ${dice1} and ${dice2}. You won $${separator(amount * 3)}!`);
                    continue;
                }
            }
        }


        guildSetup.update(interaction, members);
    }
}

function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}