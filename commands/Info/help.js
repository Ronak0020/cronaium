const { MessageEmbed } = require('discord.js');
const ms = require("ms");
const { removeDuplicates } = require("../../utils/utils");
const Server = require("../../models/server");

module.exports = {
    name: "help",
    category: "Info",
    description: "Get complete command list of the bot.",
    cooldown: 5,
    usage: "[command name]",
    aliases: ["h"],
    run: async (client, message, args) => {
        Server.findOne({
            serverID: message.guild.id
        }, async (err, server) => {
            if (err) console.log(err);
            const embed = new MessageEmbed()
                .setColor('#c6df00')
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setThumbnail(client.user.displayAvatarURL())
                .setTimestamp();

            let command = args[0];
            if (args[0]) {
                const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

                if (!cmd) return message.channel.send(`Uh-Oh! I can not find any command with name - \`${command}\` !`);

                embed.setAuthor(`Command Help - ${cmd.name.toUpperCase()}`, message.author.displayAvatarURL());
                embed.setDescription([
                    `**◉ Aliases:** ${cmd.aliases ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
                    `**◉ Description:** ${cmd.description}`,
                    `**◉ Category:** ${cmd.category}`,
                    `**◉ Cooldown** ${cmd.cooldown ? ms(cmd.cooldown * 1000) : "No cooldown"}`,
                    `**◉ Permission** ${cmd.permission ? cmd.permission.join(", ") : "No special permissions required."}`,
                    `**◉ Example** ${cmd.example ? cmd.example : "No example available."}`,
                    `**◉ Usage:** ${cmd.usage ? cmd.usage : "No arguments required."}`,
                    `**◉ Extra Info:** ${cmd.info ? cmd.info : "No info available."}`
                ]);
                embed.setFooter("Command Parameters: <> is required & [] is optional");

                return message.channel.send(embed);
            } else if (!args[0]) {
                embed.setDescription([
                    `Here is the list of all the commands of bot.`,
                    `The bot's prefix is: \`${server.prefix}\``,
                    `To get information about a specific command, type \`${server.prefix}help <command name>\``
                ]);
                embed.setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }));
                let categories = removeDuplicates(client.commands.map(cmd => cmd.category));

                for (const category of categories) {
                    embed.addField(`**${category !== undefined ? category.toUpperCase() : "Nothing"}**`, client.commands.filter(cmd =>
                        cmd.category === category).map(cmd => `\`${cmd.name}\``).join(', '));
                }
                return message.channel.send(embed);
            }
        })
    }
}