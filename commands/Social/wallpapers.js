const { MessageEmbed } = require("discord.js");
const wallpaper = require("../../assets/json/items.json").filter(d => d.category === "bgimages");

module.exports = {
    name: "wallpapers",
    category: "Social",
    cooldown: 10,
    description: "Se all the available profile backgrounds and choose which one you wanna purchase!",
    aliases: ["wallpaper", "bgimages"],
    run: async (client, message, args) => {
        const embed = new MessageEmbed();
        embed.setColor('#f0c68f');
        embed.setTitle(`\`${wallpaper[0].id}\` -- ${wallpaper[0].emoji} ${wallpaper[0].name} ---- ${wallpaper[0].price} <:spirits:814860320828817408>`)
        embed.setFooter(message.author.username, message.author.displayAvatarURL());
        embed.setTimestamp();
        embed.setImage(wallpaper[0].image);
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

            if (r.emoji.name === '▶' && wallpaperno !== wallpaper.length) {
                pageno = pageno + 1
                wallpaperno++
                r.users.remove(message.author.id);
                msg.edit(embed.setImage(wallpaper[wallpaperno].image).setTitle(`\`${wallpaper[wallpaperno].id}\` -- ${wallpaper[wallpaperno].emoji} ${wallpaper[wallpaperno].name} ---- ${wallpaper[wallpaperno].price} <:spirits:814860320828817408>`));
            }
            else if (r.emoji.name === '◀' && wallpaperno !== 0) {
                r.users.remove(message.author.id);
                pageno = pageno - 1
                wallpaperno--
                msg.edit(embed.setImage(wallpaper[wallpaperno].image).setTitle(`\`${wallpaper[wallpaperno].id}\` -- ${wallpaper[wallpaperno].emoji} ${wallpaper[wallpaperno].name} ---- ${wallpaper[wallpaperno].price} <:spirits:814860320828817408>`));
            }
        });
        collector.on('end', () => {
            msg.reactions.removeAll();
        })
    }
}