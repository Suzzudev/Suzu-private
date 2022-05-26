
const mongo = require('mongoose');

const schema = new mongo.Schema({
    userID : String,
    money : Number,
    bank : Number,
    exp : Number,
    level : Number,
    felonTime : Number,
    isFelon : String,
    timeTillReduce : Number,
    items : Array,
    bankSize : Number,
    blacklisted : Boolean
});

module.exports = mongo.model('user', schema);