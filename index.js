const { Client, Collection, MessageEmbed } = require('discord.js');
const config = require("./config.json");
const mongo = require('mongoose');
const mineflayer = require('mineflayer');
const inDb = require('./indb');
const guild = require('./schema/guild');
const generateImage = require('./generateImage');
const axios = require('axios');
const mojangAPI = require('mojang-api');


const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING', "GUILD_VOICE_STATES"],
});

mongo.connect('mongodb+srv://shareduser:notgenericpassword@database.sgj6x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    keepAlive: true,
})

mongo.connection.on('connected', () => {
    console.log('Connected to database');
})

const category = {};

//Gobal Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require('./config.json');

//Initialize the bot
require("./handler/index")(client);
client.login(client.config.token);

// Creating mineflayer bot
var options = {
    //Version
    version: "1.16.4",
    //Server
    host: "hypixel.net",
    //username
    username: process.env.EMAIL || config.EMAIL,
    //password
    password: process.env.PASSWORD || config.PASSWORD,
    //Authentication method
    auth: "microsoft"
}
var bot = mineflayer.createBot(options);


//Bot login
bot.on('login', () => {
    console.log("Minecraft Bot is online!");
});

//inParty variable
var inParty = false;

//When the bot is kicked
bot.on('kicked', (err) => {
    console.log(err);
})

//when the bot gets an error
bot.on('error', (err) => {
    console.log(err);
})

//when the bot logs in
bot.on('login', () =>{
    bot.chat("/limbo");
})

//When the bot stops
bot.on('end', () => {
    try {
        bot = mineflayer.createBot(options);
        return true;
    } catch (error) {
        console.log("Error: " + error);
        return false;
    }
});
client.on('guildMemberAdd', async (member) => {

    const response = await inDb.guild(member.guild.id);

    if (!response) {
        guild.setup(member, true);
    }

    if(!response.welcomeChannel) {
        return;
    }

    const dim = {
        height : response.welcomeImageHeight,
        width : response.welcomeImageWidth,
        marigin : response.welcomeImageMarigin
    }
    
    const av = {
        size : response.welcomeImageAvatarSize,
        x: response.welcomeImageAvatarX,
        y: response.welcomeImageAvatarY
    }

    const attachment = await generateImage(member, response.welcomeImage, av, dim); 

    const channel = client.channels.cache.get("978090207217876993"); //response.welcomeChannel
    
    channel.send(
        {
            files : [attachment],
            content : `Welcome to the server ${member.user}!`
    });
});

var isMod = false;

// Discord - minecraft chat
client.on('messageCreate', async (message) => {

    if (!message.channel.id == "878026030877663262") {

        var arg = message.content.substring(prefix.length).split(" ");

        if (!message.startsWith(prefix)) return;
        if (!message.guild.id != "843568795620606012") return;

        //Switch - case Function
        switch (arg[0].toLowerCase()) {
            case 'gmute':
                if (!isMod == true) return message.reply('You do not have permission to use this command.');

                mess = message.content.toString();
                mess = mess.replace(".gmute", "");
                bot.chat(`/g mute ${mess}`);
                break;

            case 'gunmute':
                if (!isMod == true) return message.reply('You do not have permission to use this command.');

                mess = message.content.toString();
                mess = mess.replace(".gunmute", "");
                bot.chat(`/g unmute ${mess}`);
                break;

            case 'gkick':
                if (!isMod == true) return message.reply('You do not have permission to use this command.');

                mess = message.content.toString();
                mess = mess.replace(".gkick", "");
                bot.chat(`/g kick ${mess}`);
                break;

            case 'gaccept':
                if (!isMod == true) return message.reply('You do not have permission to use this command.');

                mess = message.content.toString();
                mess = mess.replace(".gaccept", "");
                bot.chat(`/g accept ${mess}`);
                break;
        }
        if (
            message.author.bot ||
            !message.guild ||
            !message.content.toLowerCase().startsWith(client.config.prefix)
        )
            return;

        const [cmd, ...args] = message.content
            .slice(client.config.prefix.length)
            .trim()
            .split(/ +g/);

        const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

        if (!command) return;
        return await command.run(client, message, args);
    }

    if (message.channel.id != "878026030877663262") return;

    if (message.author.bot) return;

    var mess = message.content.toString();
    const userMaxSize = 94 - message.author.username.length;

    if (mess.length > userMaxSize) {
        message.reply('Your message is too long.');
        return;
    }

    bot.chat(`/gc ${message.author.username} ${message.content}`);

})

module.exports = client;


bot.on('message', async (msg) => {
    //Checking if the message still exists
    let messageChannel = client.channels.cache.get("878026030877663262");
    let logChannel = client.channels.cache.get("907818524146286643");
    let requestsChannel = client.channels.cache.get("932392310669455372");
    if (!messageChannel) console.error("Message channel doesn't exist!");
    if (!logChannel) console.error("Log channel doesn't exist!");
    if (!requestsChannel) console.error("Requests channel doesn't exist!");

    //Checking if the message loaded
    if (!msg) return console.log("Failed to read message");

    //Creating a string variable
    var string = msg.toString();

    //Creating an args variable
    var args = string.split(" ");


    //Setting up a guild message variable
    var guildMessage = false;
    if (string.includes("Guild >")) guildMessage = true;

    //Setting up a hasRank variable
    if (string.includes('[MVP++]') || string.includes('[MVP+]') || string.includes('[MVP]') || string.includes('[VIP+]') || string.includes('[VIP]')) {
        hasRank = true;
    } else {
        hasRank = false;
    }
    //When someone unmutes someone else
    if (string.includes('has unmuted') && guildMessage == false) {
        logChannel.send(string);
    }

    //When the bot is muted
    if (string.includes("You're currently muted for") && guildMessage == false) {
        bot.chat("/g unmute _Hakari");
        messageChannel.send("Please try sending that again, the bot was unmuted.");
    }

    //If I was muted
    if (string.includes("has muted [MVP+] PuppyNuff") && guildMessage == false) {
        bot.chat("/g unmute PuppyNuff");
    }

    //When someone invites the bot to a party
    if (string.includes("has invited you to join their party!") && guildMessage == false) {
        if (inParty == false) {
            bot.chat(`/p accept ${args[1]}`);
            inParty = true;

            const embed = new MessageEmbed()
                .setTitle("Bot accepted a party invite!")
                .setColor(0x00AE86)
                .addField("Invitee", args[1]);

            logChannel.send({ embeds: [embed] });
            messageChannel.send({ embeds: [embed] });

            return;
        }

        return bot.chat(`/msg ${args[1]} The bot is already in a party, sorry!`);
    }

    //When someone requests to join the guild
    if (string.includes('has requested to join the Guild!') && guildMessage == false) {

        if (hasRank == true) {
            username = args[1];
            getWeight(username, "weights", "oc");
            const requestEmbed = new MessageEmbed()
                .setAuthor(`${args[1]}`, `https://mc-heads.net/avatar/${args[1]}`, `https://sky.shiiyu.moe/stats/${args[1]}`)
                .addField(`Join request`, `${string}`)
                .addField(`Command`, `To accept them do .gaccept ${args[1]}`)
            requestsChannel.send({embeds : [requestEmbed]});
            return;
        }
        console.log(args[0]);
        username = args[0];
        console.log(username);
        getWeight(username, "weights", "oc");
    }

    //When someone does join the guild
    if (string.includes('joined the guild!') && guildMessage == false) {
        if(hasRank == true) {
            messageChannel.send(string);
            logChannel.send(string);
            return bot.chat(`/gc Welcome to the guild ${args[1]}! Do /g discord for guild discord!`);
        }

        messageChannel.send(string);
        logChannel.send(string);
        return bot.chat(`/gc Welcome to the guild ${args[0]}! Do /discord for guild discord!`);
    }

    //When someone disbands the party
    if (string.includes('disbanded') && guildMessage == false) {
        inParty = false;
    }

    //When someone goes into a dungeon
    if (string.includes('entered The Catacombs') && guildMessage == false) {
        bot.chat("/p leave");
        inParty = false;
    }

    if (guildMessage == false) return;

    //If someone chats /profile
    if (string.includes('/profile')) {
        if (hasRank == true) {
            return bot.chat(`/gc sky.shiiyu.moe/stats/${args[3]} is ${args[3]}'s profile.`);
        }

        bot.chat(`profile stats for ${args[1]} is https://sky.shiiyu.moe/stats/${args[2]} is ${args[2]}'s profile.`);
    }

    if(string.includes('/weight')) {
        if(hasRank == true) {
            return getWeight(args[3], "last_saved", "gc");
        }

        return getWeight(args[1], "last_saved", "gc");
    }

    //If someone logs onto the server

    if (string.includes('joined.')) {
        const joinedEmbed = new MessageEmbed()
            .setTitle("Guild Member Joined")
            .addField("Member", args[2])
            .setThumbnail(`https://sky.shiiyu.moe/stats/${args[2]}`)
            .setColor("55FF55");
        return logChannel.send({ embeds: [joinedEmbed] });
    }

    //When someone leaves the server
    if (string.includes('left.')) {
        const leftEmbed = new MessageEmbed()
            .setTitle(`Guild Member Left`)
            .addField(`Message : `, `${string}`)
            .setThumbnail(`https://mc-heads.net/head/${args[2]}`)
            .setColor('55ff55');
        return logChannel.send({ embeds: [leftEmbed] });
    }


    //If they have the VIP rank
    if (string.includes('[VIP]') || string.includes('[VIP+]')) {
        const vipEmbed = new MessageEmbed()
            .setAuthor(`${args[3]}`, `https://mc-heads.net/avatar/${args[3]}`, `https://sky.shiiyu.moe/stats/${args[3]}`)
            .setTitle(`${args[3]}`)
            .addField(`Message : `, `${msg}`)
            .setColor('55ff55');
        logChannel.send({ embeds: [vipEmbed] });
        return messageChannel.send({ embeds: [vipEmbed] });
    }

    //If they have the MVP or MVP+ rank
    if (string.includes('[MVP]') || string.includes('[MVP+]')) {
        const mvpEmbed = new MessageEmbed()
            .setAuthor(`${args[3]}`, `https://mc-heads.net/avatar/${args[3]}`, `https://sky.shiiyu.moe/stats/${args[3]}`)
            .setTitle(`${args[3]}`)
            .addField(`Message : `, `${msg}`)
            .setColor('00AAAA');
        logChannel.send({ embeds: [mvpEmbed] });
        return messageChannel.send({ embeds: [mvpEmbed] });
    }

    //If they have the MVP++ rank
    if (string.includes('MVP++')) {
        const mvpPlusEmbed = new MessageEmbed()
            .setAuthor(`${args[3]}`, `https://mc-heads.net/avatar/${args[3]}`, `https://sky.shiiyu.moe/stats/${args[3]}`)
            .setTitle(`${args[3]}`)
            .addField(`Message : `, `${msg}`)
            .setColor('FFAA00');
        logChannel.send({ embeds: [mvpPlusEmbed] });
        return messageChannel.send({ embeds: [mvpPlusEmbed] });
    }

    //If they don't have a rank
    const noRankEmbed = new MessageEmbed()
        .setAuthor(`${args[2]}`, `https://mc-heads.net/avatar/${args[2]}`, `https://sky.shiiyu.moe/stats/${args[2]}`)
        .setTitle(`${args[2]}`)
        .addField(`Message : `, `${msg}`)
        .setColor('151515');
    logChannel.send({ embeds: [noRankEmbed] });
    return messageChannel.send({ embeds: [noRankEmbed] });
})

async function getWeight(username, option, chat) {
    console.log(username);
    const uuid = mojangAPI.nameToUuid(username, function(err, res) {
        if (err) {
            console.log(err);
        }
        runCalculation(res[0].id, config.api_key, option, chat);
    })
}

runCalculation = async (uuid, api_key, option, chat) => {
    const { data } = await axios.get(`https://hypixel-api.senither.com/v1/profiles/${uuid}/${option}?key=${api_key}`);

    return bot.chat(`/${chat} ${data.data.username} has a weight of ${Math.round(data.data.weight)} on ${data.data.name}`);
}