const Discord = require("discord.js");
const Items = require("../../assets/json/items.json");
const Utils = require("../../utils/utils");
const User = require("../../models/user");

module.exports = {
    name: "shop",
    category: "Economy",
    cooldown: 10,
    description: "Buy some items from the shop such as Profile/Rank card backgrounds",
    usage: "[category name]",
    example: "shop bgimages",
    run: async(client, message, args) => {
        let user = await User.findOne({ userID: message.author.id }).catch(e => console.log(e));
        if (!user) {
            const newUser = new User({ userID: message.author.id, userName: message.author.username });
            await newUser.save().catch(e => console.log(e));
            message.reply("You have just been added to database. Please re-use the command to claim your dailies.")
        }

        let categories = [];
        let items = [];

        Items.forEach(item => {
            categories.push(item.category);
        })
        const embed = new Discord.MessageEmbed()
        .setTitle(`${client.user.username}'s Shop!`)
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setColor("#B7F01B");

        if(!args[0] || !Utils.removeDuplicates(categories).includes(args[0].toLowerCase())) {
            return message.channel.send(embed.setDescription(`**__Welcome to ${client.user.username}'s Shop, ${message.author}!__**
To view Items, you need to specify which category Items you wat to purchase. Please choose one category from the options below~

**AVAILABLE ITEM CATEGORIES :**
${Utils.removeDuplicates(categories).map(e => `\`${e.toUpperCase()}\``).join("\n")}

To view a catgory items, type \`shop <category name>\` for example, \`shop bgimages\` for profile background images shop!`));
        }

        if(args[0] && categories.includes(args[0].toLowerCase())) {
            Items.filter(i => i.category === args[0].toLowerCase()).forEach(item => items.push(`\`${item.id}\` - ${item.emoji} ${item.name} --------------- ${item.price}`));
            let options = {
                AUTHOR: `${client.user.username}'s Shop! - ${args[0].toUpperCase()}`,
                COLOR: "#B7F01B",
                FOOTER: `${client.user.username}`,
                FOOTERIMAGE: `${client.user.displayAvatarURL()}`
            }
            Utils.createEmbedPage(items, message, 10, "shop", options);
        }

    }
}