const client = require("../index");
const roleClaim = require("../role-claim");
const config = require("../config.json");
const fs = require("fs");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
    
    if(config.status == "online") {
        client.user.setPresence({
            status: "online",
            activities : [
                {
                    name : config.activity,
                }
            ]
        });
    }

    if(config.status == "dnd") {
        client.user.setPresence({
            status: "dnd",
            activities : [
                {
                    name : config.activity,
                }
            ]
        });
    }

    if(config.status == "idle") {
        client.user.setPresence({
            status: "idle",
            activities : [
                {
                    name : config.activity,
                }
            ]
        });
    }    

    
    roleClaim();
});
