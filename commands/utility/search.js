const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../../db.js');
const tools = require("../../tools.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Vyhledat film podle názvu')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Název filmu')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('name').toLowerCase();

    const movies = await db.list_movies();

    // Try exact match first
    let matched = movies.filter(m => m.name.toLowerCase() === query);

    // If no exact match, do partial match
    if (matched.length === 0) {
      matched = movies.filter(m => m.name.toLowerCase().includes(query));
    }

    if (matched.length === 0) {
      const notFoundEmbed = new EmbedBuilder()
        .setTitle('🎬 Film nenalezen')
        .setDescription(`Nebyly nalezeny žádné filmy odpovídající: **${query}**.`)
        .setColor('Red')
        .setTimestamp();

      return interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
    }

    let page = 0;

    function createEmbed(movie) {
      const watched = movie.watched === '1';
      const watchedText = watched ? '✅ Viděno' : '❌ Neviděno';
      const color = watched ? 'Green' : 'Red';

      const partsWatched = movie.parts_watched || 'N/A';
      const watchedDate = movie.watched_date || 'N/A';
      const genre = movie.genre ?? "None"
      const score = movie.score
        ? '⭐'.repeat(Number(movie.score)) + ` ${movie.score}/5`
        : 'Nehodnoceno';

      return new EmbedBuilder()
        .setTitle(`🎬 ${movie.name} - ID: ${movie.id}`)
        .setColor(color)
        .addFields(
          { name: 'Epizody', value: `${movie.parts}`, inline: true },
          { name: 'Viděno', value: watchedText, inline: true },
          { name: 'Viděné epizody', value: partsWatched, inline: true },
          { name: 'Přidáno dne', value: movie.added_date, inline: true },
          { name: 'Viděno dne', value: watchedDate, inline: true },
          { name: "Žánr", value: tools.getGenreFromValue(genre), inline: true },
          { name: 'Hodnocení', value: score, inline: true },
          { name: 'Strana', value: `${page + 1} / ${matched.length}`, inline: true }
        )
        .setTimestamp();
    }

    const embedMessage = await interaction.reply({
      embeds: [createEmbed(matched[page])],
      components: matched.length > 1 ? [createButtons(page, matched.length)] : [],
      fetchReply: true,
    });

    if (matched.length <= 1) return;

    const collector = embedMessage.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: "Tato tlačítka nejsou pro tebe", ephemeral: true });
      }

      if (i.customId === 'prev') {
        page = page > 0 ? page - 1 : matched.length - 1;
      } else if (i.customId === 'next') {
        page = page < matched.length - 1 ? page + 1 : 0;
      }

      i.update({
        embeds: [createEmbed(matched[page])],
        components: [createButtons(page, matched.length)],
      });
    });

    collector.on('end', () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('Zpět')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Další')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
      );

      embedMessage.edit({ components: [disabledRow] }).catch(() => {});
    });

    function createButtons(currentPage, total) {
      return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('Zpět')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(total <= 1),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Další')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(total <= 1)
      );
    }
  },
};

