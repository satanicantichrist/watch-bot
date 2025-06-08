const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require("../../db.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('edit')
		.setDescription('Edits movies info')
    .addIntegerOption(option =>
      option.setName("id")
      .setDescription("Movie id")
      .setRequired(true)
  )
    .addStringOption(option =>
      option.setName("name")
      .setDescription("Movie name")
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
      option.setName("watched_date")
      .setDescription("When it was watched")
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
    const id = interaction.options.getInteger("id");
    const name = interaction.options.getString("name");
    const episodes = interaction.options.getInteger("episodes");
    const watched = interaction.options.getBoolean("watched");
    const watched_date = interaction.options.getString("watched_date");
    const parts_watched = interaction.options.getString("parts_watched");
    const score = interaction.options.getString("score");

    if (name) { db.update_name(id, name); }
    if (episodes) { db.update_parts(id, episodes); }
    if (watched != null) { db.update_watched(id, watched);}
    if (parts_watched) { db.update_parts_watched(id, parts_watched); }
    if (score) { db.update_score(id, score); }

    const embed = new EmbedBuilder()
      .setColor("#2c0a41")
      .setTitle("Movie updated")
      .addFields(
      {name:"Name", value: `${name}`},
      {name:"Episodes", value: `${episodes}`},
      {name:"Watched", value: `${watched}`},
      {name:"Parts watched", value: `${parts_watched}`},
      {name:"score", value: `${score}`}
    )
		await interaction.reply({ embeds: [embed] });
	},
};
