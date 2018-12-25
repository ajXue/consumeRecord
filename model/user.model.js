const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    token: String,
    phone: Number,
    nickName: String,
    createTime: Date,
    updateTime: Date,
    consumeInfo: Array
})

const User = mongoose.model("User", UserSchema);

module.exports = User;