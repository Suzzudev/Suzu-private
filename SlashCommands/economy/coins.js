const inDb = require('../../indb');
const guildSetup = require('../../schema/guild');

module.exports = {
    name: 'money',
    description: 'Check a user money amount. (money & bank)',
    options: [
        {
            name: 'user',
            description: 'The user to check.',
            type: 'USER',
            required: true
        }
    ],

    async run(client, interaction) {
        var response = await inDb.guild(interaction.guild.id);

        const user = interaction.options.getUser('user');

        if (!response) {
            guildSetup.setup(interaction);
            return interaction.followUp(`Your guild wasn't in the database. We have added it for you, please rerun the command`);
        }

        var found = false;

        var members = response.members;

        for (i = 0; i < members.length; i++) {
            if (members[i].money == undefined) members[i].money = 0;
            if(members[i].bank == undefined) members[i].bank = 0;
            if(members[i].level == undefined) members[i].level = 1;
            if(members[i].xp == undefined) members[i].xp = 0;
            guildSetup.update(interaction, members);
            if(members[i].id == user.id) {
                interaction.followUp(`${user.username} has $${separator(members[i].money + members[i].bank)}`);
            }
        }


    }
}

function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}