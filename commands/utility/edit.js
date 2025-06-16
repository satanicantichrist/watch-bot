const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('edit')
    .setDescription('Edits movie info')
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
      option.setName("parts_watched")
        .setDescription("Parts watched")
    )
    .addStringOption(option =>
      option.setName("genre")
        .setDescription("Movie genre")
        .addChoices(tools.genreMap)

    )
    .addStringOption(option =>
      option.setName("score")
        .setDescription("Score 1-5")
        .addChoices(
          { name: "Nehodnoceno", value: "0"},
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
    const parts_watched = interaction.options.getString("parts_watched");
    const genre = interaction.options.getString("genre");
    const scoreStr = interaction.options.getString("score");
    const score = scoreStr ? parseInt(scoreStr, 10) : null;

    try {
      const updatedFields = [];

      if (name) {
        await db.update_name(id, name);
        updatedFields.push({ name: "Name", value: name, inline: true });
      }

      if (episodes !== null) {
        await db.update_parts(id, episodes);
        updatedFields.push({ name: "Episodes", value: episodes.toString(), inline: true });
      }

      if (watched !== null) {
        await db.update_watched(id, watched ? 1 : 0);
        updatedFields.push({ name: "Watched", value: watched ? "✅ Yes" : "❌ No", inline: true });
      }

      if (parts_watched) {
        await db.update_parts_watched(id, parts_watched);
        updatedFields.push({ name: "Parts Watched", value: parts_watched, inline: true });
      }

      if (score !== null) {
        await db.update_score(id, score === 0 ? null : score);
        updatedFields.push({ name: "Score", value: "⭐".repeat(score) + ` (${score}/5)`, inline: true });
      }

      if (genre !== null) {
        await db.update_genre(id, genre);
        updatedFields.push({ name: "Genre", value: genre, inline:true });
      }

      if (updatedFields.length === 0) {
        return interaction.reply({ content: "No fields to update were provided.", ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor("#2c0a41")
        .setTitle("Movie Updated")
        .addFields(updatedFields);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error updating movie:", error);
      await interaction.reply({ content: "❌ Failed to update movie. Please try again later.", ephemeral: true });
    }
  },
};

