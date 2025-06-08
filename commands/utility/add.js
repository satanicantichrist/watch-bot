const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require("../../db.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Adds movie.')
    .addStringOption(option =>
      option.setName("name")
      .setDescription("Movie name")
      .setRequired(true)
  )
    .addIntegerOption(option =>
      option.setName("episodes")
      .setDescription("Number of episodes")
  )
    .addBooleanOption(option =>
      option.setName("watched")
      .setDescription("If it was watched")
  )
    .addStringOption(option =>
      option.setName("parts_watched")
      .setDescription("Parts watched")
  )
    .addStringOption(option =>
      option.setName("score")
      .setDescription("Score 1-5")
      .addChoices(
      { name: "*", value: "1" },
      { name: "**", value: "2" },
      { name: "***", value: "3" },
      { name: "****", value: "4" },
      { name: "*****", value: "5" },
    )
  ),

	async execute(interaction) {
    const name = interaction.options.getString("name");
    const episodes = interaction.options.getInteger("episodes");
    const watched = interaction.options.getBoolean("watched") ?? "false";
    const parts_watched = interaction.options.getString("parts_watched");
    const score = interaction.options.getString("score");

    db.add_movie(name, episodes, watched, parts_watched, score)
    const embed = new EmbedBuilder()
      .setColor("#2c0a41")
      .setTitle("Updated name")
      .setDescription(name)
		await interaction.reply({ embeds: [embed] });
	},
};

