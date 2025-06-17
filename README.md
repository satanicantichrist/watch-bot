# Watch Bot

A feature-rich Discord bot for tracking and managing movies and series, built using [discord.js](https://discord.js.org/), Node.js, and SQLite. Easily organize, score, and update your watchlist directly from Discord!

---

## Features

- **Discord Integration:**  
  Interact with the bot via slash commands on your Discord server.

- **Movie & Series Tracking:**  
  Add, update, and remove entries to your watchlist with metadata like number of parts, watched status, score, and genre.

- **Persistent Storage:**  
  All your data is safely stored in a local SQLite database.

- **Modular Command System:**  
  Easy to extend with new commands—just drop new command files in the `commands/` folder.

- **Dockerized Deployment:**  
  Ready to run anywhere via Docker or Compose for hassle-free setup.

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/satanicantichrist/watch-bot.git
cd watch-bot
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Configure Discord Bot

- Copy `config.example.json` to `config.json` (if provided) and add your bot token.

```json
{
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "guildId": "YOUR_GUILD_ID",
  "clientId": "BOT_CLIENT_ID"
}
```

### 4. Start the Bot

```bash
node deploy-commands.js # To sync commands with discord api.
node index.js # To start the bot it self.
```

#### Or with Docker

```bash
docker-compose up --build
```

---

## Command Usage

- All commands are modular and organized under `commands/`.
- Interact with the bot using Discord slash commands (e.g. `/add`, `/list`, etc.).
- To deploy/update commands, run:

---

## Database Schema

The bot uses an SQLite database with the following schema for movies:

| Field         | Type    | Description                   |
|---------------|---------|-------------------------------|
| id            | INTEGER | Primary key                   |
| name          | TEXT    | Movie/Series name             |
| parts         | INTEGER | Number of parts/episodes      |
| added_date    | TEXT    | Date when added               |
| watched       | TEXT    | Watched status (Yes/No)       |
| watched_date  | TEXT    | Date watched                  |
| parts_watched | TEXT    | Watched parts                 |
| score         | TEXT    | Personal score (0-5)          |
| genre         | TEXT    | Genre/category                |

---

## Example Commands (from Discord)

- `/add name:<name> parts:<number> genre:<genre>`
- `/edit id:<id> name:<new-name>`
- `/remove id:<id>`
- `/list`

---

## Technologies Used

- [Node.js](https://nodejs.org/)
- [discord.js](https://discord.js.org/)
- [sqlite3](https://www.npmjs.com/package/sqlite3)
- [Docker](https://www.docker.com/) (for containerization)

---

## Project Structure

```
.
├── commands/              # All bot command modules
├── db.js                  # SQLite database logic
├── index.js               # Main bot entrypoint
├── config.json            # Config file
├── deploy-commands.js     # Command registration script
├── Dockerfile             # Docker setup
├── docker-compose.yml     # Multi-container orchestration
└── package.json           # Dependencies and scripts
```

---

## Contributing

Pull requests and suggestions are welcome! Please open an issue first for major changes or feature requests.

---

## License

[MIT](LICENSE)  
Copyright © satanicantichrist

