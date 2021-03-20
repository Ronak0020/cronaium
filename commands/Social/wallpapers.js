const {MessageEmbed} = require("discord.js");
const wallpaper = require("../../assets/json/profilebackgrounds.json");

module.exports = {
    name: "wallpapers",
    run: async(client, message, args) => {

        const embed = new MessageEmbed();
        embed.setColor('#009696')
        embed.setAuthor(`${message.guild.name} Leaderboard`, message.guild.iconURL())
        embed.setFooter(`Page: 1`, message.author.displayAvatarURL())
        .setImage(wallpaper[0]);
        let wallpaperno = 0;

        let pageno = 1;
        const msg = await message.channel.send({
            embed: embed
        });

            const reaction1 = await msg.react('◀');
            const reaction2 = await msg.react('▶');

            const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id, {
                time: 120000
            });
            collector.on('collect', (r) => {
                let reactionadd = wallpaperno--
                let reactionremove = wallpaperno++

                if (r.emoji.name === '▶' && reactionadd !== -1) {
                    pageno = pageno + 1
                    wallpaperno++
                    console.log(wallpaperno)
                    r.users.remove(message.author.id);
                    msg.edit(embed.setImage(wallpaper[wallpaperno]));
                }
                else if (r.emoji.name === '◀' && reactionremove !== 24) {
                    r.users.remove(message.author.id);
                    pageno = pageno - 1
                    wallpaperno--
                    msg.edit(embed.setImage(wallpaper[wallpaperno]));
                }
            });
            collector.on('end', () => {
                msg.reactions.removeAll();
            })
        }
    }