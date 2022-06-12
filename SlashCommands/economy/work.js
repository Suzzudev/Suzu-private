// import schema files
const guildSetup = require('../../schema/guild');
const inDb = require('../../indb');

//set up file
module.exports = {
    name: 'work',
    description: 'work for money',
    options: [
        {
            name: 'time',
            description: 'the amount of time to work for',
            type: 'INTEGER',
            required: true
        }
    ],

    async run(client, interaction) {
        const time = interaction.options.getInteger('time');
        const response = await inDb.guild(interaction.guild.id);

        if (!response) {
            guildSetup.setup(interaction);
            return interaction.followUp(`Your guild wasn't in the database. We have added it for you, please rerun the command`);
        }

        var members = response.members;

        for (i = 0; i < members.length; i++) {
            if (members[i].money == undefined) members[i].money = 0;
            if (members[i].bank == undefined) members[i].bank = 0;
            if(members[i].level == undefined) members[i].level = 1;
            if(members[i].xp == undefined) members[i].xp = 0;
        }

        for (i = 0; i < members.length; i++) {
            if (response.members[i].id == interaction.user.id) {
                if(time > members[i].level) {
                    return interaction.followUp(`You can't work for that long.`);
                }
                var exp = randomizeExpGain(time, members[i].level);
                var money = estimateEarnings(time, members[i].level);
                members[i].xp += exp;
                members[i].money += money;
                var amountNeeded;
                interaction.followUp(`You worked for ${time} hours and earned ${exp} experience and ${money} money.`);
                if(members[i].xp > members[i].level * 100) {
                    members[i].level += 1;
                    members[i].xp = 0;
                    interaction.channel.send(`You leveled up to level ${members[i].level}!`);
                }
                console.log(members[i].xp);
                console.log(members[i].level);
                console.log(members[i].level * 100);
                return await guildSetup.update(interaction, members);
            }
        }
    }
}

function estimateEarnings(time, level) {
    min = Math.ceil(11);
    max = Math.floor(21);
    return Math.round(((Math.floor(Math.random() * (max - min + 1)) + min) * time) * ((level / 10) + 1));
}

function randomizeExpGain(time, level) {
    min = Math.ceil(10);
    max = Math.floor(20);
    return Math.round((((Math.floor(Math.random() * (max - min + 1)) + min) * time) * ((level / 10) + 1)) / 2);
}