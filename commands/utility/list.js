

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const db = require('../../db.js');

const MOVIES_PER_PAGE = 5;

function paginateMovies(movies, page = 0) {
  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
  const start = page * MOVIES_PER_PAGE;
  const currentMovies = movies.slice(start, start + MOVIES_PER_PAGE);

  const embed = new EmbedBuilder()
    .setTitle('🎬 Movie List')
    .setColor('#00bfff')
    .setTimestamp()
    .setFooter({ text: `Page ${page + 1} of ${totalPages} • Your Movie Tracker Bot` });

  for (const movie of currentMovies) {
    const watched = movie.watched === '1' ? '✅ Yes' : '❌ No';
    const partsWatched = movie.parts_watched || 'N/A';
    const watchedDate = movie.watched_date || 'N/A';
    const score = movie.score
      ? '⭐'.repeat(Number(movie.score)) + ` ${movie.score}/5`
      : 'Not rated';

    const watchedLine =
      movie.watched === '1' && Number(movie.parts) === 1
        ? `• Watched: ✅ Yes`
        : `• Watched: ${watched} (${partsWatched})`;

    const description = [
      `• Parts: ${movie.parts}`,
      `• Genre: ${movie.genre}`,
      watchedLine,
      `• Added: ${movie.added_date}`,
      `• Watched on: ${watchedDate}`,
      `• Score: ${score}`,
    ].join('\n');

    embed.addFields({
      name: `🎬 ${movie.name} - ${movie.id}`,
      value: description,
    });
  }

  return { embed, totalPages };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('List movies with pagination.')
    .addBooleanOption(option =>
      option.setName('unwatched')
        .setDescription('List only unwatched movies')
    ),

  async execute(interaction) {
    const movies = await db.list_movies();
    const unwatchedOnly = interaction.options.getBoolean('unwatched');
    const filteredMovies = unwatchedOnly
      ? movies.filter(m => m.watched === '0')
      : movies;

    if (filteredMovies.length === 0) {
      return interaction.reply({
        content: 'No movies found for this view.',
        ephemeral: true
      });
    }

    let page = 0;
    const { embed, totalPages } = paginateMovies(filteredMovies, page);

    const prevButton = new ButtonBuilder()
      .setCustomId('prev_page')
      .setLabel('⬅️ Previous')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    const nextButton = new ButtonBuilder()
      .setCustomId('next_page')
      .setLabel('Next ➡️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(totalPages <= 1);

    const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

    await interaction.reply({ embeds: [embed], components: [row] });
    const message = await interaction.fetchReply();

    const collector = message.createMessageComponentCollector({ time: 60_000 });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: "These buttons aren't for you.", ephemeral: true });
      }

      if (i.customId === 'prev_page') {
        page--;
      } else if (i.customId === 'next_page') {
        page++;
      }

      const { embed: newEmbed } = paginateMovies(filteredMovies, page);
      prevButton.setDisabled(page === 0);
      nextButton.setDisabled(page >= totalPages - 1);

      await i.update({ embeds: [newEmbed], components: [row] });
    });

    collector.on('end', () => {
      prevButton.setDisabled(true);
      nextButton.setDisabled(true);
      interaction.editReply({ components: [row] }).catch(() => {});
    });
  }
};

