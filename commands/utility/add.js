const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../../db.js");
const tools = require("../../tools.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Přidá film do seznamu.")
    .addStringOption((option) => option.setName("name").setDescription("Název filmu").setRequired(true))
    .addIntegerOption((option) => option.setName("episodes").setDescription("Počet epizod"))
    .addBooleanOption((option) => option.setName("watched").setDescription("Byl už viděn"))
    .addStringOption((option) => option.setName("trailer").setDescription("Odkaz na trailer"))
    .addStringOption((option) => option.setName("parts_watched").setDescription("Viděné epizody"))
    .addStringOption((option) => option.setName("genre").setDescription("Žánr").addChoices(tools.genreMap))
    .addStringOption((option) =>
      option
        .setName("score")
        .setDescription("Hodnocení")
        .addChoices(
          { name: "Nehodnoceno", value: "0" },
          { name: "*", value: "1" },
          { name: "**", value: "2" },
          { name: "***", value: "3" },
          { name: "****", value: "4" },
          { name: "*****", value: "5" },
        ),
    ),

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const episodes = interaction.options.getInteger("episodes") ?? 1;
    const watched = interaction.options.getBoolean("watched") ?? false;
    const parts_watched = interaction.options.getString("parts_watched") ?? "None";
    const genre = interaction.options.getString("genre") ?? "None";
    const scoreStr = interaction.options.getString("score") === "0" ? null : interaction.options.getString("score");
    const trailer = interaction.options.getString("trailer") ?? null;
    const score = scoreStr ? parseInt(scoreStr, 10) : null;

    try {
      await db.add_movie(name, episodes, watched ? 1 : 0, parts_watched, score, genre, trailer);

      const embed = new EmbedBuilder()
        .setColor("#2c0a41")
        .setTitle("🎬 Film přidán")
        .setDescription(`**${name}** Byl přidán do seznamu`)
        .addFields(
          { name: "Epizody", value: episodes.toString(), inline: true },
          { name: "Viděno", value: watched ? "✅ Ano" : "❌ Ne", inline: true },
          { name: "Epizody viděny", value: parts_watched, inline: true },
          { name: "Žánr", value: tools.getGenreFromValue(genre), inline: true },
          { name: "Trailer", value: trailer ? `[Zobrazit](${trailer})` : "Žádný", inline: true },
          { name: "Hodnocení", value: score !== null ? "⭐".repeat(score) + ` (${score}/5)` : "Nehodnoceno", inline: true },
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error adding movie:", error);
      await interaction.reply({ content: "❌ Nebylo možné přidat film.", ephemeral: true });
    }
  },
};
