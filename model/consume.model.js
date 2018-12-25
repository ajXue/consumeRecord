const mongoose = require("mongoose");

const consumeSchema = mongoose.Schema({
    textName: String,
    type: String,
    price: Number,
    createTime: Date,
    desc: String
})

const Consume = mongoose.model('Consume', consumeSchema);

module.exports = Consume;