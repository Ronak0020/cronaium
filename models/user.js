const { Schema, model } = require("mongoose");

const user = new Schema({
  userID: { type: String },
  userName: { type: String },
  coins: { type: Number, default: 0 },
  gems: { type: Number, default: 0 },
  inventory: { type: Array, default: [] },
  dailyCooldown: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  streakCooldown: { type: Number, default: 0 },
  reputationCooldown: { type: Number, default: 0 },
  premium: { type: Boolean, default: false },
  premiumDuration: { type: String, default: "" },
  backgroundType: { type: String, default: "COLOR" },
  backgroundData: { type: String, default: "#282828" },
  allColor: { type: String, default: "#F1F1F1" },
  progressColor: { type: String, default: "#F1F1F1" },
  progressType: { type: String, default: "COLOR" },
  reputation: { type: Number, default: 0 },
  marriageHarem: { type: Array, default: [] },
  married: { type: Boolean, default: false },
  marriedTo: { type: Object, default: {} },
  requests: { type: Array, default: [] },
  //friendRequests: { type: Array, default: [] },
  friends: { type: Array, default: [] },
  profileTitle: { type: String, default: "Normal Human" },
  profileColor: { type: String, default: "#ffffff" },
  profileBackground: { type: String, default: "107" },
  profileAbout: { type: String, default: "I am just a normal discord user" },
  achievements: { type: Array, default: [] },
  botcommandsUsed: { type: Number, default: 0 }
})

module.exports = model("cronaiumUser", user);