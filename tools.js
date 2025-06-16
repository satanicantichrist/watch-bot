const genreMap = [
  { name: "Horror", value: "horror" },
  { name: "Akční", value: "action" },
  { name: "Pohádka", value: "kids" },
  { name: "Komedie", value: "comedy" },
  { name: "Fantazi", value: "fantazi" },
  { name: "Žádný", value: "none" }
];

function getGenreFromValue(value) {
  const genre = genreMap.find(item => item.value === value);
  return genre ? genre.name : "Neznámý žánr"; // "Unknown genre" fallback
}

module.exports = {
  getGenreFromValue,
  genreMap,
}

