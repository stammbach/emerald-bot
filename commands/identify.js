const { MessageEmbed } = require('discord.js');
const { checkEmeraldID } = require('../flow/scripts/checkEmeraldID');
const { resolveAddressObject } = require('../flow/scripts/resolveNames');

const execute = async (interaction, options) => {
    await interaction.deferReply({ ephemeral: true });
    let discordUser = options.getUser('user');
    let discordId = discordUser.id;
    const emeraldIds = await checkEmeraldID(discordId);
    if (!emeraldIds) {
        await interaction.followUp({ ephemeral: true, content: 'This user does not have an EmeraldID.' })
        return;
    }
    const obj = await resolveAddressObject(emeraldIds["blocto"]);
    sendIdentification(interaction, emeraldIds, obj.resolvedNames.find, obj.resolvedNames.fn, discordId)
}

const sendIdentification = async (interaction, emeraldIds, find, fn, discordId) => {
    const embed = new MessageEmbed()
        .setColor('#5bc595')
        .addFields(
            { name: 'Blocto Address', value: emeraldIds["blocto"] || "N/A", inline: true },
            { name: 'Dapper Address', value: emeraldIds["dapper"] || "N/A", inline: true },
            { name: '.find', value: find || "N/A", inline: true },
            { name: '.fn', value: fn || "N/A", inline: true },
            { name: 'Discord User', value: `<@${discordId}>`, inline: true },
            { name: 'EmeraldID', value: "✅", inline: true }
        )
        .setAuthor('Emerald City', 'https://i.imgur.com/YbmTuuW.png', 'https://discord.gg/emeraldcity')
        .setThumbnail('https://i.imgur.com/UgE8FJl.png');

    await interaction.editReply({ embeds: [embed] }).catch(e => console.log(e));
}

module.exports = {
    name: 'identify',
    description: 'identify an on-chain user',
    execute,
}