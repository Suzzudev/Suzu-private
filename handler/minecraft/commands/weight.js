const mojangAPI = require('mojang-api');
const config = require('../../../config.json')
const axios = require('axios')

async function run(username, bot, chat) {
    return getWeight(username, "last_saved", bot, chat);
}

async function getWeight(username, option, bot, chat) {
    const uuid = mojangAPI.nameToUuid(username, function(err, res) {
        if (err) {
            console.log(err);
        }

        if(chat == "oc") {
            option = "weights";
        }

        runCalculation(res[0].id, config.api_key, option, bot, chat);
    })
}

runCalculation = async (uuid, api_key, option, bot, chat) => {
    const { data } = await axios.get(`https://hypixel-api.senither.com/v1/profiles/${uuid}/${option}?key=${api_key}`);

    console.log(`/${chat} ${data.data.username} has a weight of ${Math.round(data.data.weight)} on ${data.data.name}`);

    return bot.chat(`/${chat} ${data.data.username} has a weight of ${Math.round(data.data.weight)} on ${data.data.name}`);
}

function seperator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}

module.exports = {
    run: run
}