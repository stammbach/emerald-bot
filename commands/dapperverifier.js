// A command for all Dapper Products
const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const { holdingScripts } = require('../flow/holdings/dapperholdings');

const execute = async (interaction, options) => {
    if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        const role = interaction.guild.roles.cache.find(role => role === options.getRole('role'));
        if (!role) {
            await interaction.reply({ ephemeral: true, content: 'This role does not exist.' }).catch(e => console.log(e));
            return;
        }

        const customName = options.getString('customname');
        const convertedName = customName.replace(/\s/g, "").toLowerCase()
        if (!holdingScripts[convertedName]) {
            await interaction.reply({ ephemeral: true, content: 'This custom name does not exist.' }).catch(e => console.log(e));
            return;
        }
        verifyCustomButton(interaction, customName, convertedName, role.id);
    }
}

const verifyCustomButton = async (interaction, customName, convertedName, roleId) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`verifyDapper-${convertedName}-${roleId}`)
                .setLabel('Verify')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setURL('https://id.ecdao.org/')
                .setLabel('Reset')
                .setStyle('LINK')
        );

    const embed = new MessageEmbed()
        .setColor('#5bc595')
        .setTitle(`Verify you own a ${customName}`)
        .setAuthor('Emerald City', 'https://i.imgur.com/YbmTuuW.png', 'https://discord.gg/emeraldcity')
        .setDescription('Click the `Verify` button below to get the ' + `<@&${roleId}>` + ' role with your EmeraldID.')
        .setThumbnail('https://i.imgur.com/UgE8FJl.png');

    await interaction.reply({ ephemeral: false, embeds: [embed], components: [row] }).catch(e => console.log(e));
}

module.exports = {
    name: 'dapperverifier',
    description: 'setup a role verification with emeraldid for dapper products (nbats and ufc strike)',
    execute,
}