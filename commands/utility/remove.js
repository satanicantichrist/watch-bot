const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require("../../db.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Removes movie.')
    .addIntegerOption(option =>
      option.setName("id")
      .setDescription("Movie id")
      .setRequired(true)
    ),

	async execute(interaction) {
    const id = interaction.options.getInteger("id");

    db.remove_movie(id);

    const embed = new EmbedBuilder()
      .setColor("#2c0a41")
      .setTitle("Removed movie")
		await interaction.reply({ embeds: [embed] });
	},
};

