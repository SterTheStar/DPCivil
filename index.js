const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { fork } = require('child_process');
const { token, channelId, adminRole, blacklistRole, exonerarChannel, exonerarRole } = require('./config.json');
const schedule = require('node-schedule');
const UserManager = require('./utils/userManager')
const userManager = new UserManager()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.requests = new Collection();

client.config = {
  channelId: channelId, adminRole: adminRole, blacklistRole: blacklistRole, exonerarChannel: exonerarChannel, exonerarRole: exonerarRole
}

// Load commands
const commandsPath = path.join(__dirname, 'commands'); 
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Reset monthly ranking every 1st day of the month at 00:00:00 in Sao Paulo time zone
const job = schedule.scheduleJob('0 0 0 1 * *', 'America/Sao_Paulo', function() {
  console.log('Resetting monthly ranking...');
  userManager.resetMonthly()
  console.log('Monthly ranking reset complete.');
});

// Run dashboard server
const dashboardPath = path.join(__dirname, 'dashboard', 'server.js');
fork(dashboardPath)


client.login(token);