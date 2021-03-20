const Discord = require("discord.js");
const serverUser = require("../../models/serverUser");

module.exports = {
  name: "afk",
  category: "Utility",
  description: "Set your AFK message so any one who pings you will be informed you are AFK",
  example: "afk I am busy.",
  usage: "[reason]",
  cooldown: 5,
  run: async(client, message, args) => {
    const reason = args.join(" ") || "AFK";
    serverUser.findOne({
      userID: message.author.id,
      serverID: message.guild.id
    }, async(err, user) => {
      if(err) console.log(err);
      if(!user) {
        const newUser = new serverUser({
          userID: message.author.id,
          serverID: message.guild.id,
          AFK: true,
          AFKtime: Date.now(),
          AFKreason: reason
        })
        await newUser.save().catch(e => console.log(e));
        message.reply(`I set your AFK: ${reason}`);
      } else if(user) {
        user.AFK = true;
        user.AFKtime = Date.now();
        user.AFKreason = reason;
        await user.save().catch(e => console.log(e));
        message.reply(`I set your AFK: ${reason}`);
      }
    })
  }
}