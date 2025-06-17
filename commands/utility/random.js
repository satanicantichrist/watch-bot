const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getQuery } = require("../../db.js");
const tools = require("../../tools.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Náhodný film ze seznamu")
    .addStringOption(option =>
      option.setName("genre")
        .setDescription("Filtrovat pomocí žánru")
        .addChoices(tools.genreMap)
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option.setName("watched")
        .setDescription("Filtrovat podle vidění")
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
        await interaction.reply("⚠️ Nebyly nalezeny žádné filmy.");
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`🎬 ${movie.name}`)
        .setColor(0x00bfff)
        .addFields(
          { name: "Epizody", value: movie.parts?.toString() || "N/A", inline: true },
          { name: "Hodnocení", value: movie.score  ? '⭐'.repeat(Number(movie.score)) + ` ${movie.score}/5`
      : 'Nehodnoceno', inline: true },
          { name: "Žánr", value: tools.getGenreFromValue(movie.genre) || "N/A", inline: true },
          { name: "Viděno", value: movie.watched == 1 ? "✅ Ano" : "❌ Ne", inline: true },
          { name: "Viděno dne", value: movie.watched_date || "N/A", inline: true },
          { name: "Viděné epizody", value: movie.parts_watched || "N/A", inline: true },
          { name: "Přidáno dne", value: movie.added_date || "N/A", inline: false }
        )

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("❌ Error in /random command:", error);
      await interaction.reply("❌ Nebylo možno vybrat film.");
    }
  },
};

