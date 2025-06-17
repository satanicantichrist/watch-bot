const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require("../../db.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Odstraní film ze seznamu')
    .addIntegerOption(option =>
      option.setName("id")
        .setDescription("ID filmu")
        .setRequired(true)
    ),

  async execute(interaction) {
    const id = interaction.options.getInteger("id");

    try {
      // Optional: fetch movie first to show details in the confirmation
      const movies = await db.list_movies();
      const movie = movies.find(m => m.id === id);

      if (!movie) {
        return interaction.reply({
          content: `❌ Film s ID \`${id}\` nebyl nalezen.`,
          ephemeral: true
        });
      }

      await db.remove_movie(id);

      const embed = new EmbedBuilder()
        .setColor("#a83232")
        .setTitle("🎞️ Film odstraněn")
        .setDescription(`Odstraněno **${movie.name}** (ID: ${movie.id})`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error removing movie:", error);
      await interaction.reply({
        content: "❌ Chyba při odstraňování filmu ze seznamu.",
        ephemeral: true
      });
    }
  },
};

