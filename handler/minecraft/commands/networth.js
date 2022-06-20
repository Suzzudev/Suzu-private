const mojangApi = require("mojang-api");
const axios = require('axios');
const config = require('../../../config.json');

async function run(username, bot) {
    const networth = await getNetworth(username, bot);
}

async function getNetworth(username, bot) {
    const uuid = mojangApi.nameToUuid(username, function(err, res) {
        if(err) {
            console.error(err);
        }

        networthCalculator(res[0].id, username, bot);
    })
}

const getActiveProfile = function (profiles, uuid) {
    return profiles.sort((a,b) => b.members[uuid].last_save - a.members[uuid].last_save)[0];
}

networthCalculator = async function(uuid, username, bot) {
    const { data } = await axios.get(`https://api.hypixel.net/skyblock/profiles?key=${config.api_key}&uuid=${uuid}`);

    const profiles = data.profiles;

    const activeProfile = getActiveProfile(data.profiles, uuid);

    const profile = activeProfile.members[uuid];
    profile.banking = activeProfile.banking;

    var success = true;

    const response = await axios.post('https://skyblock.acebot.xyz/api/networth/categories', { data: profile}).catch(err => {
        success = false;
        console.log(err);
    });
    if(!success) return bot.chat('/gc Error: Could not connect to the API.');

    var total = response.data.data.networth + response.data.data.bank + response.data.data.purse;

    total = Math.round(total);

    var total = seperator(total);

    return bot.chat(`/gc ${username} has a networth of ${total}`);
}

function seperator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}

module.exports = {
    run: run
};