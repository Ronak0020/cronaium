const Discord = require("discord.js");
const User = require("../../models/user.js");
//const tips = require("../../assets/tips.json");
const ms = require("ms");

module.exports = {
  name: "daily",
  category: "Economy",
  description: "Claim your daily items!!",
  run: async (client, message, args) => {
    let dailies;
    let ldailies = 0;
    let luck = Math.floor(Math.random() * 100);
    if (luck < 30) {
      dailies = Math.floor(Math.random() * (30 - 20)) + 20;
    } else if (luck > 30 && luck < 80) {
      dailies = Math.floor(Math.random() * (60 - 40)) + 40;
    } else if (luck > 80) {
      dailies = Math.floor(Math.random() * (100 - 50)) + 50;
    }
    if (luck > 95) {
      ldailies = 1;
    }

    let user = await User.findOne({ userID: message.author.id }).catch(e => console.log(e));
        if (!user) {
            const newUser = new User({ userID: message.author.id, userName: message.author.username });
            await newUser.save().catch(e => console.log(e));
            message.reply("You have just been added to database. Please re-use the command to claim your dailies.")
        }

      const embed = new Discord.MessageEmbed()
        .setTitle("Daily Rewards!")
        .setColor("#f56ccf")
        .setTimestamp()
        //.addField("💡 Tips", tips[Math.floor(Math.random() * tips.length)])
        .setThumbnail(message.author.avatarURL());
      if (user.dailyCooldown > Date.now()) return message.channel.send("", embed.setFooter(`Your current streak: ${user.streak}`, client.user.displayAvatarURL()), embed.setDescription(`Oops! You need to wait ${ms(user.dailyCooldown - Date.now(), { long: true })} more to claim your daily again`));
      user.dailyCooldown = Date.now() + 1000 * 60 * 60 * 24;
      if (luck > 95) user.gems += 1;
      if (user.streakCooldown > Date.now()) {
        user.streak += 1;
        user.streakCooldown = Date.now() + 86400000 + 86400000;
      } else if (user.streakCooldown < Date.now()) {
        user.streak = 0;
        user.streakCooldown = Date.now() + 86400000 + 86400000;
      }
      let dd = dailies * user.streak / 2;
      user.coins += dailies + Math.ceil(dd);
      await user.save().catch(e => console.log(e));
      let info = `You have successfully gained your daily bonus of total **${dailies}** <:spirits:814860320828817408>!\nYou are on **${user.streak}** days streak! That means, you got an extra bonus of **${Math.ceil(dd)}** <:spirits:814860320828817408>!`;
      if (luck > 95) info += `\nWoah! You are too lucky! You found **1** <:legendaryspirits:814860322460532776> !}`;
      info += `\n\nYou need to wait ${ms(user.dailyCooldown - Date.now(), { long: true })} more to claim your daily again.`;
      embed.setFooter(`Your current streak: ${user.streak}`, client.user.displayAvatarURL());
      embed.setDescription(info)
      message.channel.send("", embed)
  }
}