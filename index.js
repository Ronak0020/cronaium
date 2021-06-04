const { Collection, Client } = require("discord.js");
const fs = require("fs");

const client = new Client({
    disableMentions: "everyone"
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
client.cooldowns = new Collection();
client.games = new Collection();
client.musicManager = require("./music/manager")(client);

["command", "event"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.once("ready", () => { client.musicManager.init(client.user.id) });
client.on("raw", (d) => client.musicManager.updateVoiceState(d));

client.login(process.env.TOKEN)
