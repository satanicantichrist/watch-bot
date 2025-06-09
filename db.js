const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbFilePath = path.resolve(__dirname, "./db.db");
const dbExists = fs.existsSync(dbFilePath);

const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");

    if (!dbExists) {
      // Initialize schema if DB file did not exist
      const createTableSql = `
        CREATE TABLE movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          parts INTEGER,
          added_date TEXT,
          watched TEXT,
          watched_date TEXT,
          parts_watched TEXT,
          score TEXT,
          genre TEXT
        );
      `;
      db.run(createTableSql, (err) => {
        if (err) {
          console.error("❌ Error creating tables:", err.message);
        } else {
          console.log("✅ Database tables created.");
        }
      });
    }
  }
});

// Utility to wrap db.run in a Promise
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error("❌ SQL error:", err.message);
        return reject(err);
      }
      resolve(this); // 'this' contains metadata like lastID or changes
    });
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Utility to wrap db.all in a Promise
function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error("❌ SQL error:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// Add a new movie
async function add_movie(name, parts, watched, parts_watched, score, genre) {
  if (!name || typeof parts !== "number") {
    throw new Error("Invalid input for add_movie");
  }
  const now = new Date().toDateString();
  return runQuery(
    `INSERT INTO movies (name, parts, added_date, watched, watched_date, parts_watched, score, genre) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, parts, now, watched, "Never", parts_watched, score, genre],
  );
}

// Update functions
async function update_name(id, name) {
  if (!name) throw new Error("Name is required");
  return runQuery(`UPDATE movies SET name = ? WHERE id = ?`, [name, id]);
}

async function update_parts(id, parts) {
  if (typeof parts !== "number") throw new Error("Parts must be a number");
  return runQuery(`UPDATE movies SET parts = ? WHERE id = ?`, [parts, id]);
}

async function update_watched(id, watched) {
  const watched_date = watched ? new Date().toDateString() : "Never";
  return runQuery(`UPDATE movies SET watched = ?, watched_date = ? WHERE id = ?`, [watched, watched_date, id]);
}

async function update_parts_watched(id, parts_watched) {
  return runQuery(`UPDATE movies SET parts_watched = ? WHERE id = ?`, [parts_watched, id]);
}

async function update_score(id, score) {
  if (score != null && (score < 0 || score > 5)) {
    throw new Error("Score must be between 0 and 5");
  }
  return runQuery(`UPDATE movies SET score = ? WHERE id = ?`, [score, id]);
}

async function update_genre(id, genre) {
  return runQuery("UPDATE movies SET genre = ? WHERE id = ?", [genre, id]);
}

async function remove_movie(id) {
  return runQuery(`DELETE FROM movies WHERE id = ?`, [id]);
}

async function list_movies() {
  return getAll(`SELECT * FROM movies`);
}

// Optional: Graceful shutdown
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("❌ Error closing database:", err.message);
    } else {
      console.log("🛑 Database connection closed.");
    }
    process.exit();
  });
});

module.exports = {
  add_movie,
  update_name,
  update_parts,
  update_watched,
  update_parts_watched,
  update_score,
  update_genre,
  remove_movie,
  list_movies,
  getQuery,
};
