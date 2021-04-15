const { MessageEmbed, Collection, Client } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const { GiveawaysManager } = require("discord-giveaways");
const Salvage = require("salvage-music");

const client = new Client({
    disableMentions: "everyone"
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
client.cooldowns = new Collection();
client.games = new Collection();

// Starts updating currents giveaways
const manager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});
client.giveawaysManager = manager;

["command", "event"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

// client.music = new Salvage(
//     client,
//     [
//       {
//         name: `node1`,
//         auth: `123ronak`,
//         host: `localhost`,
//         port: 7000,
//       },
//     ],
//     {
//       newSong: (song) => `Now playing: ${song.title} by ${song.author}`,
//       destroy: () => `I left.`,
//     }
//   );

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {

    let embed = new MessageEmbed()
        .setTitle("Entry Denied!")
        .setTimestamp()
        .setColor("RED")
        .setFooter(client.user.username, client.user.displayAvatarURL());

    REQ.findOne({
        messageID: giveaway.messageID
    }, async (err, give) => {
        if (err) console.log(err);
        if (!give) return;
        if (give.roleRequirement !== "none") {
            if (!member.roles.cache.has(give.roleRequirement)) {
                reaction.users.remove(member.user);
                member.user.send(embed.setDescription(`Your entry for the giveaway of **${giveaway.prize}** has been declined!
You need to have the role **${member.guild.roles.cache.get(give.roleRequirement).name}** in order to be able to participate.`))
            }
        }
        if (give.serverRequirement !== "none") {
            if (!client.guilds.cache.get(give.serverRequirement).members.includes(member)) {
                reaction.users.remove(member.user);
                member.user.send(embed.setDescription(`Your entry for the giveaway of **${giveaway.prize}** has been declined!
You need to be in server **${client.guilds.cache.get(give.serverRequirement).name}** in order to be able to participate.`))
            }
        }
    })
})

client.login("Nzg5NTE2NTc3NzAzNTkxOTc3.X9zMnA.RMWyBJ2v7gmbrYOj9y3VFYzPlfs")
