const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./db.db");


function add_movie(name, parts, watched, parts_watched, score) {
  const now = new Date();
  db.run("INSERT INTO movies (name, parts, added_date, watched, watched_date, parts_watched, score) VALUES(?, ?, ?, ?, ?, ?, ?)",
    [name, parts, now.toDateString(), watched, now.toDateString(), parts_watched, score])
}

function update_name(id, name){
  db.run("UPDATE movies SET name = ? WHERE id = ?", [name, id]);
}

function update_parts(id, parts){
  db.run("UPDATE movies SET parts = ? WHERE movies.id = ?", [parts, id]);
}

function update_watched(id, watched){
  db.run("UPDATE movies SET watched = ? WHERE movies.id = ?", [watched, id]);
}

function update_parts_watched(id, parts_watched) {
  db.run("UPDATE movies SET parts_watched = ? WHERE movies.id = ?", [parts_watched, id]);
}

function update_score(id, score){
  db.run("UPDATE movies SET score = ? WHERE movies.id = ?", [score, id])
}

function remove_movie(id){
  db.run("DELETE FROM movies WHERE movies.id = ?", [id]);
}

function list_movies(id){
 return new Promise((resolve, reject) => {
    db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) {
            reject(err);
        } else {
            resolve(rows);  // ← This sends the data to the `await`
        }
    });
});
}

module.exports = {
  add_movie: add_movie,
  update_name: update_name,
  update_parts: update_parts,
  update_watched: update_watched,
  update_parts_watched: update_parts_watched,
  update_score: update_score,
  remove_movie: remove_movie,
  list_movies: list_movies
}
