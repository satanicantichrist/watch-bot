const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require("../../db.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Adds a movie.')
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
      option.setName("genre")
        .setDescription("Movie genre")
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
    const episodes = interaction.options.getInteger("episodes") ?? 1;
    const watched = interaction.options.getBoolean("watched") ?? false;
    const parts_watched = interaction.options.getString("parts_watched") ?? "None";
    const genre = interaction.options.getString("genre") ?? "None";
    const scoreStr = interaction.options.getString("score");
    const score = scoreStr ? parseInt(scoreStr, 10) : null;

    try {
      await db.add_movie(name, episodes, watched ? 1 : 0, parts_watched, score, genre);

      const embed = new EmbedBuilder()
        .setColor("#2c0a41")
        .setTitle("🎬 Movie Added")
        .setDescription(`**${name}** has been added to your list.`)
        .addFields(
          { name: "Episodes", value: episodes.toString(), inline: true },
          { name: "Watched", value: watched ? "✅ Yes" : "❌ No", inline: true },
          { name: "Parts Watched", value: parts_watched, inline: true },
          { name: "Genre", value: genre, inline: true },
          { name: "Score", value: score !== null ? "⭐".repeat(score) + ` (${score}/5)` : "Not rated", inline: true }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error adding movie:", error);
      await interaction.reply({ content: "❌ Failed to add movie. Please try again later.", ephemeral: true });
    }
  },
};


