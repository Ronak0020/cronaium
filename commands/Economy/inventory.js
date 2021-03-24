const { MessageEmbed } = require("discord.js");
const User = require("../../models/user");
const Utils = require("../../utils/utils");
const Item = require("../../assets/json/items.json");

module.exports = {
  name: "inventory",
  category: "Economy",
  cooldown: 15,
  description: "Check the items you have in your inventory.",
  aliases: ["inv"],
  example: "inventory bgimages",
  usage: "[item category]",
  run: async (client, message, args) => {
    let item = [];

    User.findOne({
      userID: message.author.id
    }, async (err, user) => {
      if (err) console.log(err);
      if (!user) {
        const newUser = new User({ userID: message.author.id, userName: message.author.username });
        await newUser.save().catch(e => console.log(e));
        message.reply("You have just been added to database. You have nothing in inventory right now ;-; I hope you get some stuffs here soon.")
      }
      for (i = 0; i < Utils.removeDuplicates(user.inventory).length; i++) {
        let index = Item.findIndex(e => e.id === Utils.removeDuplicates(user.inventory)[i]);
        const length = user.inventory.filter(o => o === Item[index].id)
        item.push(`\`${Item[index].id}\` --- ${Item[index].emoji} **__${Item[index].name.toUpperCase()}__** (${length.length})\n${Item[index].description}`)
      }
      if (item.length < 1) item.push("Nothing is available here.")
      if (item.length < 7) {
        const embed = new MessageEmbed()
          .setTitle("Inventory")
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setTimestamp()
          .setThumbnail(message.author.avatarURL())
          .setColor("#f6a55d")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(item.join("\n\n"))
        message.channel.send(embed)
      } else {
        let options = {
          AUTHOR: `${message.author.username}'s Inventory!`,
          COLOR: "#B7F01B",
          FOOTER: `${client.user.username}`,
          FOOTERIMAGE: `${client.user.displayAvatarURL()}`
        }
        Utils.createEmbedPage(item, message, 6, "inventory", options);
      }
    })
  }
}