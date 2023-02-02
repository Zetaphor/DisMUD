require("dotenv").config();

const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const token = process.env.DISCORD_TOKEN;

const botId = "1062778315573837904";
const targetUserId = "134317574342180864";
let targetUser = null;

const client = new Client({
  intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag} with ID ${c.user.id}`);
  client.users.fetch(targetUserId, false).then((user) => {
    targetUser = user;
    targetUser.send("hello world");
  });
});

client.on(Events.MessageCreate, (msg) => {
  if (msg.author.id === targetUserId) {
    console.log(msg.author.id, `${msg.author.username}#${msg.author.discriminator}`);
    console.log(msg.content);
    msg.react("⚔️");
  } else if (msg.author.id === botId) {
    msg.react("🇳");
    msg.react("🇪");
    msg.react("🇸");
    msg.react("🇼");
    msg.react("🇺");
    msg.react("🇩");
  }
});

const emojiDirections = {
  "🇳": "north",
  "🇪": "east",
  "🇸": "south",
  "🇼": "west",
  "🇺": "up",
  "🇩": "down",
};

const emojiDirectionKeys = Object.keys(emojiDirections);

client.on(Events.MessageReactionAdd, (reaction, user) => {
  // Don't listen to reactions from the bot or reactions on the users messages
  if (user.bot || !reaction.message.author.bot) return;
  const dirName = emojiDirections[reaction._emoji.name];
  if (typeof dirName !== "undefined") {
    targetUser.send(dirName);
  }
});

client.login(token);
