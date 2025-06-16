const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getQuery } = require("../../db.js");
const tools = require("../../tools.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("randommovie")
    .setDescription("🎲 Get a random movie from the database, with optional filters.")
    .addStringOption(option =>
      option.setName("genre")
        .setDescription("Filter by genre")
        .addChoices(tools.genreMap)
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option.setName("watched")
        .setDescription("Filter by watched status (true = watched, false = not watched)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const genre = interaction.options.getString("genre");
    const watched = interaction.options.getBoolean("watched");

    try {
      let conditions = [];
      let params = [];

      if (genre) {
        conditions.push("genre = ?");
        params.push(genre);
      }

      if (watched === true) {
        conditions.push("watched = 1");
      } else if (watched === false) {
        conditions.push("(watched IS NULL OR watched = 0)");
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const sql = `SELECT * FROM movies ${whereClause} ORDER BY RANDOM() LIMIT 1`;

      const movie = await getQuery(sql, params);

      if (!movie) {
        await interaction.reply("⚠️ No matching movies found in the database.");
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`🎬 ${movie.name}`)
        .setColor(0x00bfff)
        .addFields(
          { name: "Parts", value: movie.parts?.toString() || "N/A", inline: true },
          { name: "Score", value: movie.score  ? '⭐'.repeat(Number(movie.score)) + ` ${movie.score}/5`
      : 'Not rated', inline: true },
          { name: "Genre", value: tools.getGenreFromValue(movie.genre) || "N/A", inline: true },
          { name: "Watched", value: movie.watched == 1 ? "✅ Yes" : "❌ No", inline: true },
          { name: "Watched Date", value: movie.watched_date || "N/A", inline: true },
          { name: "Parts Watched", value: movie.parts_watched || "N/A", inline: true },
          { name: "Added Date", value: movie.added_date || "N/A", inline: false }
        )
        .setFooter({ text: "Random movie fetched from the database 🎲" });

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("❌ Error in /randommovie command:", error);
      await interaction.reply("❌ Something went wrong while fetching a movie.");
    }
  },
};

