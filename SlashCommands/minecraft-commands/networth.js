const axios = require('axios');
const mojangAPI = require('mojang-api');
const config = require(`../../config.json`);
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "networth",
    description: "Sends the users networth",
    category: "minecraft",
    options : [
        {
            name: 'user',
            description : "The players username",
            type: "STRING",
            required: true,
        },
    ],
    run : async(client, interaction) => {

        const API_KEY = config.api_key;

        const user = interaction.options.getString('user');

        mojangAPI.nameToUuid(user, function(err, res) {
            if (err) {
                console.log(err);
            } else {

                if(res[0] == null) return interaction.followUp(`${user} is not a valid username`);
                runNetworth(res[0].id, API_KEY, interaction, user);
            }
        });
    }
}

const getActiveProfile = function (profiles, uuid) {
    return profiles.sort((a,b) => b.members[uuid].last_save - a.members[uuid].last_save)[0];
}

function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}

const runNetworth = async function(uuid, key, interaction, user) {
    networth = await getNetworth(uuid, key);

    if(networth == false) {
        return interaction.followUp(`Unable to get networth for ${user}`);
    }

    console.log(networth.data.categories);

    data = networth.data

    var bank = data.bank;
    if(bank == null) bank = 0;
    bank = Math.round(bank);
    bank = separator(bank);

    var purse = data.purse;
    if(purse == null) purse = 0;
    purse = Math.round(purse);
    purse = separator(purse);
    
    var sacks = data.sacks;
    Math.round(sacks);
    if(sacks == null) sacks = 0;
    sacks = Math.round(sacks);
    sacks = separator(sacks);

    var total = data.networth;

    total = separator(total);

    var storage = data.categories.storage;
    var enderchest = data.categories.enderchest;
    var armor = data.categories.armor;
    var wardrobe_inventory = data.categories.wardrobe_inventory;
    var pets = data.categories.pets;
    var talismans = data.categories.talismans;

    
    var storageItemsCount = storage.top_items.length;
    var enderchestItemsCount = enderchest.top_items.length;
    var armorItemsCount = armor.top_items.length;
    var wardrobeInventoryItemsCount = wardrobe_inventory.top_items.length;
    var petsItemsCount = pets.top_items.length;
    var talismansItemsCount = talismans.top_items.length;
    
    var storageItems = "";
    var enderchestItems = "";
    var armorItems = "";
    var wardrobeInventoryItems = "";
    var petsItems = "";
    var talismansItems = "";

    if(storageItemsCount > 4) storageItemsCount = 4;
    if(enderchestItemsCount > 4) enderchestItemsCount = 4;
    if(armorItemsCount > 4) armorItemsCount = 4;
    if(wardrobeInventoryItemsCount > 4) wardrobeInventoryItemsCount = 4;
    if(petsItemsCount > 4) petsItemsCount = 4;
    if(talismansItemsCount > 4) talismansItemsCount = 4;


    for (var i = 0; i < storageItemsCount; i++) {
        storageItems += `${storage.top_items[i].name} : ${separator(storage.top_items[i].price)} \n`;
    }

    for (var i = 0; i < enderchestItemsCount; i++) {
        enderchestItems += `${enderchest.top_items[i].name} : ${separator(enderchest.top_items[i].price)} \n`;
    }

    for (var i = 0; i < armorItemsCount; i++) {
        armorItems += `${armor.top_items[i].name} : ${separator(armor.top_items[i].price)} \n`;
    }

    for (var i = 0; i < wardrobeInventoryItemsCount; i++) {
        wardrobeInventoryItems += `${wardrobe_inventory.top_items[i].name} : ${separator(wardrobe_inventory.top_items[i].price)} \n`;
    }

    for (var i = 0; i < petsItemsCount; i++) {
        petsItems += `${pets.top_items[i].name} : ${separator(pets.top_items[i].price)} \n`;
    }

    for (var i = 0; i < talismansItemsCount; i++) {
        talismansItems += `${talismans.top_items[i].name} : ${separator(talismans.top_items[i].price)} \n`;
    }
    
    const embed = new MessageEmbed()
        .setAuthor(`${user}'s networth`, `https://mc-heads.net/avatar/${user}`, `https://sky.shiiyu.moe/stats/${user}`)
        .addField('**Networth:**', `${total.toString()}`)
        .addField('bank', bank.toString())
        .addField('purse', purse.toString())
        .addField('sacks', sacks.toString())
        .addField('Storage', "Total :" + separator(networth.data.categories.storage.total) + "\n" + storageItems)
        .addField('Enderchest', "Total :" + separator(networth.data.categories.enderchest.total) + "\n" + enderchestItems)
        .addField('Armor', "Total :" + separator(networth.data.categories.armor.total) + "\n" + armorItems)
        .addField('Wardrobe Inventory', "Total :" + separator(networth.data.categories.wardrobe_inventory.total) + "\n" + wardrobeInventoryItems)
        .addField('Pets', "Total :" + separator(networth.data.categories.pets.total) + "\n" + petsItems)
        .addField('Talismans', "Total :" + separator(networth.data.categories.talismans.total) + "\n" + talismansItems)
        .setThumbnail(`https://crafatar.com/renders/body/${uuid}?overlay`)
        .setColor('#0099ff');
    interaction.followUp({ embeds: [embed] });
}

const getNetworth = async function (uuid, key) {
    const { data } = await axios.get(`https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`);

    const activeProfile = getActiveProfile(data.profiles, uuid);


    const profile = activeProfile.members[uuid];
    profile.banking = activeProfile.banking;

    var success = true;

    var response = await axios.post('https://skyblock.acebot.xyz/api/networth/categories', { data: profile }).catch(err => {
        success = false;
    });

    console.log(success);

    if(success == false) {
        response = await axios.post('https://maro.skybrokers.xyz/api/networth/categories', { data: profile }).catch(err => {

            success = false;
        });
    }

    if(success == false) {
        return false;
    }


    return response.data;
}
