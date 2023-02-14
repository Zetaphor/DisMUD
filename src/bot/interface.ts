require("dotenv").config();

const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const token = process.env.DISCORD_TOKEN;

let botId = null;

/**
 * The main object that exports the Discord.js client, event listeners, and helper functions
 * @typedef {Object} BotInterface
 * @property {Client} client - A Discord.js client instance
 * @property {function} getUser - A function to retrieve a user from Discord by their ID
 * @property {Object} listeners - An object that holds the event listeners for the Discord.js client
 * @property {function} on - A function to add an event listener to the Discord.js client
 * @property {function} emit - A function to trigger an event and call its listeners
 * @property {function} waitForEvent - A function to wait for a specific event to occur before resolving
 */
const botInterface = {
  client: new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  }),
  getUser,
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

/**
 * Retrieves a user from Discord by their ID
 * @function getUser
 * @param {string|number} id - The Discord user ID
 * @returns {Promise} - Resolves with the Discord user object, or rejects if the user cannot be retrieved
 */
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
  console.info(`Ready! Logged in as ${c.user.tag} with ID ${c.user.id}`);
  botInterface.emit("ready", null);
});

botInterface.client.on(Events.MessageCreate, (msg) => {
  if (msg.author.id === botId) {
    // console.info("Saw bot message");
  } else {
    botInterface.emit("playerMsg", {
      user: msg.author,
      content: msg.content,
    });
  }
});

// botInterface.client.on(Events.MessageReactionAdd, (reaction, user) => {
//   // Don't listen to reactions from the bot or reactions on the users messages
//   if (user.bot || !reaction.message.author.bot) return;
//   botInterface.emit("msgReaction", {
//     reaction,
//     user,
//   });
//   reaction.message.react("🇳");
// });

export default function setupBotInterface() {
  console.info("Starting bot...");
  botInterface.client.login(token);
  return botInterface;
}
