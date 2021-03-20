const mongoose = require("mongoose");

const user = mongoose.Schema({
    serverID: {type: String},
    userID: {type: String},
    warnReason: {type: Array, default: []},
    warnMod: {type: Array, default: []},
    muteCount: {type: Number, default: 0},
    mute: {type: Boolean, default: false},
    banCount: {type: Number, default: 0},
    kickCount: {type: Number, default: 0},
    AFK: {type: Boolean, default: false},
    AFKreason: {type: String, default: ""},
    AFKtime: {type: String, default: ""}
});

module.exports = mongoose.model("CronaiumserverUser", user);