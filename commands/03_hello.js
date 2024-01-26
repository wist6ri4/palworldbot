// 環境変数の読み込み
const { USHIDA_ID } = require('../config.json');
// SlashCommandBuilderの読み込み
const { SlashCommandBuilder } = require('discord.js');

/**
* Hello
*/
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('あいさつに反応してbotが返事をします'),
    execute: async function(interaction) {
        await interaction.reply(`${USHIDA_ID}\nこんにちは`);
    },
};