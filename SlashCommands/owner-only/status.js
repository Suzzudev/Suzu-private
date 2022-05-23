const discord = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');

module.exports = {
    name: "status",
    description: "Sets the status of the bot",
    options: [ 
        {
            name: "activity",
            description: "The status of the bot",
            required: true,
            type: "STRING"
        },
        {
            name : "status", 
            description: "The type of activity",
            required: true,
            type: "STRING"
        }
    ],
    run: async (client, interaction) => {
        if(!interaction.user.id == config.ownerID) return;
        let activity = interaction.options.getString("activity");
        let status = interaction.options.getString("status");


        if(status != "online" && status != "dnd" && status != "idle") return interaction.followUp("Invalid status");

        if(status == "online") {
            client.user.setPresence({
                status: "online",
                activities : [
                    {
                        name : activity,
                    }
                ]
            });
        }

        if(status == "dnd") {
            client.user.setPresence({
                status: "dnd",
                activities : [
                    {
                        name : activity,
                    }
                ]
            });
        }

        if(status == "idle") {
            client.user.setPresence({
                status: "idle",
                activities : [
                    {
                        name : activity,
                    }
                ]
            });
        }

        updateJson(activity, status);

        return interaction.followUp("Activity set to :  " + activity + ", status set to : " + status);
    }
}

function updateJson(activity, status) {
    
    const json = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    json.activity = activity;
    json.status = status;
    fs.writeFileSync('./config.json', JSON.stringify(json, null, 2));
}


