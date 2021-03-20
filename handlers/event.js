const { readdirSync } = require("fs");

module.exports = (client) => {
        let files = readdirSync(`./events/`).filter(file => file.endsWith(".js"));
        files = files.filter(f => f.endsWith('.js'));
        files.forEach(f => {
            const event = require(`../events/${f}`);
            client.on(f.split('.')[0], event.bind(null, client));
            delete require.cache[require.resolve(`../events/${f}`)];
        });
}