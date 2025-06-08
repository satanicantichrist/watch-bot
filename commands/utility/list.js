const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require("../../db.js");

function createUnwatchedMoviesEmbed(movies) {
    const unwatched = movies.filter(movie => movie.watched === '0');

    if (unwatched.length === 0) {
        return new EmbedBuilder()
            .setTitle('🎬 Unwatched Movies')
            .setDescription('✅ You have watched all movies! Nothing to show here.')
            .setColor('Green')
            .setTimestamp();
    }

    const embed = new EmbedBuilder()
        .setTitle('🎬 Unwatched Movies')
        .setColor('#ff5050') // red-ish
        .setTimestamp()
        .setFooter({ text: 'Your Movie Tracker Bot' });

    for (const movie of unwatched) {
        const partsWatched = movie.parts_watched || 'None';
        const score = movie.score ? '⭐'.repeat(Number(movie.score)) + ` ${movie.score}/5` : 'Not rated';

        const description = [
            `• Parts: ${movie.parts}`,
            `• Watched: ❌ No (${partsWatched})`,
            `• Added: ${movie.added_date}`,
            `• Score: ${score}`,
        ].join('\n');

        embed.addFields({
            name: `🎬 ${movie.name} - ${movie.id}`,
            value: description,
        });
    }

    return embed;
}


function createMoviesEmbed(movies) {
    const embed = new EmbedBuilder()
        .setTitle('🎬 Movie List')
        .setColor('#00bfff') // light blue
        .setTimestamp()
        .setFooter({ text: 'Your Movie Tracker Bot' });

    for (const movie of movies) {
        const watched = movie.watched === '1' ? '✅ Yes' : '❌ No';
        const partsWatched = movie.parts_watched || 'N/A';
        const watchedDate = movie.watched_date || 'N/A';
        const score = '⭐'.repeat(Number(movie.score)) + ` ${movie.score}/5`;

        const description = [
            `• Parts: ${movie.parts}`,
            `• Watched: ${watched} (${partsWatched})`,
            `• Added: ${movie.added_date}`,
            `• Watched on: ${watchedDate}`,
            `• Score: ${score}`,
        ].join('\n');

        embed.addFields({
            name: `🎬 ${movie.name} - ${movie.id}`,
            value: description,
        });
    }

    return embed;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('List movies.')
    .addBooleanOption(option =>
      option.setName("unwatched")
      .setDescription("List unwatched movies")
    ),


	async execute(interaction) {

    const movies = await db.list_movies();
    const unwatched = interaction.options.getBoolean("unwatched");
    var embed = "";
    if (unwatched) {
      embed = createUnwatchedMoviesEmbed(movies)
    }else {
      embed = createMoviesEmbed(movies)
    }

    await interaction.reply({ embeds: [embed] });
	},
};

