const axios = require('axios');
const config = require('../../../config.json');
const uuid = '6df4bea8306042fabccb316e6de66ea0';

const { data } = await axios.get(`https://api.hypixel.net/skyblock/profiles?key=${config.api_key}&uuid=${uuid}`);

const profiles = data.profiles;

const activeProfile = getActiveProfile(data.profiles, uuid);

const profile = activeProfile.members[uuid];
profile.banking = activeProfile.banking;