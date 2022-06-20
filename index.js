const { Client, Collection, MessageEmbed } = require('discord.js');
const config = require("./config.json");
const mongo = require('mongoose');
const mineflayer = require('mineflayer');
const inDb = require('./indb');
const guild = require('./schema/guild');
const generateImage = require('./generateImage');
const axios = require('axios');
const mojangAPI = require('mojang-api');
const minecraftHandler = require('./handler/minecraft/commandHandler');
const commandList = ['/bitches', '/networth', '/weight'];

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING', "GUILD_VOICE_STATES"],
});

mongo.connect('mongodb+srv://shareduser:notgenericpassword@database.sgj6x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    keepAlive: true,
})

mongo.connection.on('connected', () => {
    console.log('Connected to database');
})

var queue = [];

//Gobal Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require('./config.json');

//Initialize the bot
require("./handler/index")(client);
client.login(client.config.token);

// Creating mineflayer bot
var options = {
    version: "1.8.9",
    host: "hypixel.net",
    username: process.env.EMAIL,
    password: process.env.PASSWORD,
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
    bot.chat("/p leave");
})
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
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

// Discord - minecraft chat
client.on('messageCreate', async (message) => {
    if (message.channel.id != "878026030877663262") return;

    if (message.author.bot) return;

    var mess = message.content.toString();
    const userMaxSize = 94 - message.author.username.length;

    if (mess.length > userMaxSize) {
        message.reply('Your message is too long.');
        return;
    }

    bot.chat(`/gc ${message.author.username}: ${message.content}`);

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

    if(string.includes('...Follow...')) {
        followPlayer();
    }

    
    //When someone unmutes someone else
    if (string.includes('has unmuted') && guildMessage == false) {
        logChannel.send(string);
    }

    //If I was muted
    if (string.includes("has muted [MVP+] PuppyNuff") && guildMessage == false) {
        bot.chat("/g unmute PuppyNuff");
    }

    if(string.includes("has muted _Hakari") && guildMessage == false) {
        bot.chat("/g unmute _hakari");
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

        queue.push(args[1]);

        return bot.chat(`/msg ${args[1]} The bot is already in a party, sorry!`);
    }

    //When someone requests to join the guild
    if (string.includes('has requested to join the Guild!') && guildMessage == false) {

        if (hasRank == true) {
            username = args[1];
            minecraftHandler.weight(username, bot, "oc");
            return;
        }
        username = args[0];
        username = username.replace("-", "");
        minecraftHandler.weight(username, bot, "oc");
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
        bot.chat(`/p ${queue[0]}`);
    }

    if(string.includes("joined the party.") && guildMessage == false) {
        inParty = true;
        bot.chat(`/p transfer ${queue[0]}`);
        queue = queue.shift();
        console.log(queue);
    }

    //When someone goes into a dungeon
    if (string.includes('entered The Catacombs') && guildMessage == false) {
        bot.chat("/p leave");
        inParty = false;
        bot.chat(`/p ${queue[0]}`);
    }

    if (guildMessage == false) return;

    if(string.includes('/weight')) {
        if(hasRank == true) {
            return minecraftHandler.weight(args[3], bot, "gc");
        }

        return minecraftHandler.weight(args[1], bot, "gc");
    }

    if(string.includes('/bitches')) {
        if(hasRank == true) {
            minecraftHandler.bitches(args[3], bot);
        }

        minecraftHandler.bitches(args[1], bot);
    }

    if(string.includes('/networth')) {
        if(hasRank == true) {
            return minecraftHandler.networth(args[3], bot);
        }
        else {
            return minecraftHandler.networth(args[1], bot);
        }
    }
    
    string = string.replace("Guild >" , "");

    if(args[2] == "_Hakari") {
        return;
    }

    messageChannel.send(string);
    return logChannel.send(string);
})