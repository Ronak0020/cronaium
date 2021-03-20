const Discord = require("discord.js");
const User = require("../../models/user");
const check = require("is-hexcolor");

module.exports = {
    name: "rankcard",
    description: "Configure he color an background of your rank card",
    aliases: ["rankconfig", "cardconfig"],
    cooldwon: 5,
    example: "rankcard setcolor #f67cfc",
    usage: "<option> <value>",
    category: "Levels",
    run: async(client, message, args) => {
        User.findOne({
            userID: message.author.id
        }, async(err, user) => {
            if(err) console.log(err);
            const embed = new Discord.MessageEmbed()
            .setTitle("Rank Card Configuration")
            .setColor("#fa67cf")
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()
            .setThumbnail(message.author.displayAvatarURL());
            if(!args[0]) return message.channel.send(embed.setDescription(`Welcome to **${client.user.username}'s** Rank card Configuration menu for __**${message.author.username}**__ user!
            To configure a feature, type \`config <option> <new value>\`
            **List of available options are :**
            \`backgroundcolor\`
            \`backgroundimage\`
            \`setcolor\`
            \`progressbarcolor\``));

            switch(args[0].toLowerCase()) {
                case "backgroundcolor":
                    if(!args[1]) return message.channel.send(embed.setDescription(`To set a background color, you need to provide it's HEX COLOR CODE. You can search for some hex color codes from-
                    https://htmlcolorcodes.com`));
                    if(args[1]) {
                        let valid = check(args[1]);
                        if(!valid) return message.reply(`**${args[1]}** is not a valid hex color code! To set a background color, you need to provide it's HEX COLOR CODE. You can search for some hex color codes from-
                        https://htmlcolorcodes.com`);
                        user.backgroundType = "COLOR";
                        user.backgroundData = args[1];
                        await user.save().catch(e => console.log(e));
                        message.channel.send(embed.setDescription(`Successfully updated background color!`).setColor(args[1]));
                    }
                    break;
                case "backgroundimage":
                    if(!args[1]) return message.channel.send(embed.setDescription(`To set a background image, you need to provide the image URL.`));
                    if(args[1]) {
                        user.backgroundType = "IMAGE";
                        user.backgroundData = args[1];
                        await user.save().catch(e => console.log(e));
                        message.channel.send(embed.setDescription(`Successfully updated background image!`));
                    }
                    break;
                case "setcolor":
                    if(!args[1]) return message.channel.send(embed.setDescription(`To set a color, you need to provide it's HEX COLOR CODE. You can search for some hex color codes from-
                    https://htmlcolorcodes.com`));
                    if(args[1]) {
                        let valid = check(args[1]);
                        if(!valid) return message.reply(`**${args[1]}** is not a valid hex color code! To set a color, you need to provide it's HEX COLOR CODE. You can search for some hex color codes from-
                        https://htmlcolorcodes.com`);
                        user.allColor = args[1];
                        await user.save().catch(e => console.log(e));
                        message.channel.send(embed.setDescription(`Successfully updated the color!`).setColor(args[1]));
                    }
                    break;
                    case "progressbarcolor":
                        if(!args[1]) return message.channel.send(embed.setDescription(`To set a progress bar color, you need to provide it's HEX COLOR CODE. You can search for some hex color codes from-
                        https://htmlcolorcodes.com`));
                        if(args[1]) {
                            let valid = check(args[1]);
                            if(!valid) return message.reply(`**${args[1]}** is not a valid hex color code! To set a progress bar color, you need to provide it's HEX COLOR CODE. You can search for some hex color codes from-
                            https://htmlcolorcodes.com`);
                            user.progressColor = args[1];
                            await user.save().catch(e => console.log(e));
                            message.channel.send(embed.setDescription(`Successfully updated the progress bar color!`).setColor(args[1]));
                        }
                        break;
            }
        })
    }
}