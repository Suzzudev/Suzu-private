//Import schema files
var inDb = require('../../indb');
var guild = require('../../schema/guild');

module.exports = {
    name : 'daily',
    description : 'Collect daily rewards.',

    run : async function(client, interaction) {
        const response = await inDb.guild(interaction.guild.id);

        if(!response) {
            guild.setup(interaction);
            return interaction.followUp(`Your guild wasn't in the database. We have added it for you, please rerun the command`);
        }
        var members = response.members;
        for(i = 0; i < members.length; i++) {
            if(members[i].money == undefined) members[i].money = 0;
            if(members[i].bank == undefined) members[i].bank = 0;
            if(members[i].level == undefined) members[i].level = 1;
            if(members[i].xp == undefined) members[i].xp = 0;

            if(members[i].id == interaction.user.id) {
                if(members[i].daily == undefined) members[i].daily = 0;
                if(members[i].dailyStreak == undefined) members[i].dailyStreak = 0;

                members[i].dailyStreak += 1;

                console.log(members[i].dailyStreak);

                const amount = Math.round((Math.floor(Math.random() * (members[i].dailyStreak * 10)) + 1) * (members[i].level * 10) * 10);

                console.log(amount);

                if(Date.now() - members[i].daily > 1000 * 60 * 60 * 24) {
                    members[i].daily = Date.now();
                    members[i].money = members[i].money + amount;

                    console.log(members[i].money);
                    interaction.followUp(`You have collected your daily reward of $${amount}`);
                } else {
                    interaction.followUp(`You have already collected your daily reward.`);
                }
            }

            await guild.update(interaction, members);
        }
    }
}