const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { getMember } = require("../../utils/utils");
const suser = require("../../models/serverUser");

const flags = {
	DISCORD_EMPLOYEE: '<:3942_DiscordStaff:739397592747606016>',
	DISCORD_PARTNER: '<:DiscordPartner:739397449562718209>',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: '<:Hypesquad:739398226007818281>',
	HOUSE_BRAVERY: '<:badge_bravery:787167890108448778>',
	HOUSE_BRILLIANCE: '<:brilliance:787167886413529098>',
	HOUSE_BALANCE: '<:badge_balance:787167893577138178>',
	EARLY_SUPPORTER: '<:EarlySupporter:739398672172843128>',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: '<:verified:739398885625036821>',
	VERIFIED_DEVELOPER: '<:DSG_BotDev:739397532643491922>'
};
const premium_type = [
	"None",
	"<:nitro:739400766472585258>",
	"<:PR_Discord1MonthBoosting:739397852517761064>"
]

module.exports = {
	name: "whois",
	aliases: ["userinfo"],
	description: "Check a user's information.",
	usage: "[@member]",
	category: "Info",
	cooldown: 5,
	example: "whois @Rem#1698",
	run: async (client, message, args) => {
		const member = getMember(message, args.join(" "));
		const roles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(role => role.toString())
			.slice(0, -1);
		let userFlags = "None";
		if (member.user.flags !== undefined) userFlags = member.user.flags.toArray().map(flag => flags[flag]).join(', ');
		suser.findOne({
			serverID: message.guild.id,
			userID: member.id
		}, async (err, user) => {
			if (err) console.log(err);
			let embed;
			if (!user) {
				embed = new MessageEmbed()
					.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
					.setColor(member.displayHexColor || '#fa69fd')
					.setFooter(client.user.username, client.user.displayAvatarURL())
					.addField('User Information', [
						`**-> Username:** ${member.user.username}`,
						`**-> Discriminator:** ${member.user.discriminator}`,
						`**-> ID:** ${member.id}`,
						`**-> Badges:** ${userFlags}`,
						`**-> Nitro:** ${premium_type[member.user.premium_type]}`,
						`**-> Time Created:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} (${moment(member.user.createdTimestamp).fromNow()})`,
						`**-> Status:** ${member.user.presence.status}`,
						`**-> Game:** ${member.user.presence.game || 'Not playing a game.'}`,
						`\u200b`
					], true)
					.addField('Member Information', [
						`**-> Highest Role:** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
						`**-> Server Join Date:** ${moment(member.joinedAt).format('LL LTS')}`,
						`**-> Total Roles:** ${member.roles.cache.size}`,
						`**-> Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
						`\u200b`
					], true);
			} else if (user) {
				embed = new MessageEmbed()
					.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
					.setColor(member.displayHexColor || '#fa69fd')
					.setFooter(client.user.username, client.user.displayAvatarURL())
					.addField('User Information', [
						`**-> Username:** ${member.user.username}`,
						`**-> Discriminator:** ${member.user.discriminator}`,
						`**-> ID:** ${member.id}`,
						`**-> Badges:** ${userFlags}`,
						`**-> Time Created:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} (${moment(member.user.createdTimestamp).fromNow()})`,
						`**-> Status:** ${member.user.presence.status}`,
						`**-> Game:** ${member.user.presence.game || 'Not playing a game.'}`,
						`\u200b`
					], true)
					.addField('Member Information', [
						`**-> Highest Role:** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
						`**-> Server Join Date:** ${moment(member.joinedAt).format('LL LTS')}`,
						`**-> Total Roles:** ${member.roles.cache.size}`,
						`**-> Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
						`**-> Total Warnings | Mutes | Kicks | Bans :** ${user.warnReason.length} | ${user.muteCount} | ${user.kickCount} | ${user.banCount}`,
						`\u200b`
					], true);
			}
			return message.channel.send(embed);
		})
	}
}