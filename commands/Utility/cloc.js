const { MessageEmbed } = require('discord.js');
const { formatNumber } = require('../../utils/utils');
const { promisify } = require('util');
const exec = promisify(require('child_process').execFile);
const path = require('path');
let cache = null;

module.exports = {
    name: "cloc",
    run: async (client, message, args) => {

        async function clocc() {
            if (cache) return cache;
            const { stdout, stderr } = await exec(
                path.join(__dirname, '..', '..', 'node_modules', '.bin', 'cloc'),
                ['--json', '--exclude-dir=node_modules', path.join(__dirname, '..', '..')]
            );
            if (stderr) throw new Error(stderr.trim());
            cache = JSON.parse(stdout.trim());
            return cache;
        }

        const cloc = await clocc().catch(e => console.log(e));
        const embed = new MessageEmbed()
            .setColor(0x00AE86)
            .setFooter(`${cloc.header.cloc_url} ${cloc.header.cloc_version}`)
            .addField(`❯ JS (${formatNumber(cloc.JavaScript.nFiles)})`, formatNumber(cloc.JavaScript.code), true)
            .addField(`❯ JSON (${formatNumber(cloc.JSON.nFiles)})`, formatNumber(cloc.JSON.code), true)
            .addField(`❯ MD (${formatNumber(cloc.Markdown.nFiles)})`, formatNumber(cloc.Markdown.code), true)
            .addField('\u200B', '\u200B', true)
            .addField(`❯ Total (${formatNumber(cloc.SUM.nFiles)})`, formatNumber(cloc.SUM.code), true)
            .addField('\u200B', '\u200B', true);
        return message.channel.send(embed);
    }
}