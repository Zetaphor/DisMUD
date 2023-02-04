require("dotenv").config();

const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const token = process.env.DISCORD_TOKEN;

let botId = null;

const botInterface = {
  client: new Client({
    intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  }),
  getUser: getUser,
  listeners: {},
  on(event, cb) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(cb);
  },
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data));
    }
  },
  async waitForEvent(event) {
    return new Promise((resolve) => {
      this.client.once(Events.ClientReady, (c) => {
        resolve(event);
      });
    });
  },
};

async function getUser(id) {
  return new Promise((resolve, reject) => {
    botInterface.client.users
      .fetch(id.toString())
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        console.error(`Failed to get user ${id}`, err);
        reject();
      });
  });
}

botInterface.client.once(Events.ClientReady, (c) => {
  botId = c.user.id;
  console.log(`Ready! Logged in as ${c.user.tag} with ID ${c.user.id}`);
  botInterface.emit("ready", null);
});

botInterface.client.on(Events.MessageCreate, (msg) => {
  if (msg.author.id === botId) {
    // console.log("Saw bot message");
  } else {
    botInterface.emit("playerMsg", {
      user: msg.author,
      content: msg.content,
    });
  }
});

export default function setupBotInterface() {
  console.log("Starting bot...");
  botInterface.client.login(token);
  return botInterface;
}

//   msg.react("🇳");
//   msg.react("🇪");
//   msg.react("🇸");
//   msg.react("🇼");
//   msg.react("🇺");
//   msg.react("🇩");
// } else if (activeSessions.indexOf(msg.author.id) === -1) {
//   botInterface.client.users.fetch(targetUserId).then((targetUser) => messages.menu.newSessionMessage(targetUser));
// } else if (msg.author.id) {
//   console.log(msg.author.id, `${msg.author.username}#${msg.author.discriminator}`);
//   console.log(msg.content);
//   msg.react("⚔️");
// }

// const emojiDirections = {
//   "🇳": "north",
//   "🇪": "east",
//   "🇸": "south",
//   "🇼": "west",
//   "🇺": "up",
//   "🇩": "down",
// };

// const emojiDirectionKeys = Object.keys(emojiDirections);

// botInterface.client.on(Events.MessageReactionAdd, (reaction, user) => {
//   // Don't listen to reactions from the bot or reactions on the users messages
//   if (user.bot || !reaction.message.author.bot) return;
//   const dirName = emojiDirections[reaction._emoji.name];
//   if (typeof dirName !== "undefined") {
//     targetUser.send(dirName);
//   }
// });
