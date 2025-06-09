#!/bin/sh

# Check for config.json
if [ ! -f ./config.json ]; then
  echo "⚠️ config.json not found. Creating default template..."
  cat <<EOF >./config.json
{
  "token": "YOUR_BOT_TOKEN_HERE",
  "clientId": "YOUR_CLIENT_ID",
  "guildId": "YOUR_GUILD_ID"
}
EOF
  echo "✅ Default config.json created. Please update it with your real values."
fi

# Run the bot
echo "🚀 Starting bot..."
node deploy-commands.js && node index.js
