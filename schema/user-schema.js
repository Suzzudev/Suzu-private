
const mongo = require('mongoose');

const schema = new mongo.Schema({
    userID : String,
    latestMessage : String,
    money : Number,
    bank : Number,
    exp : Number,
    level : Number,
    pings : String,
    felonTime : Number,
    isFelon : String,
    timeTillReduce : Number,
    items : Array,
    bankSize : Number
});

module.exports = mongo.model('user', schema);