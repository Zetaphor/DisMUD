require("dotenv").config();

// const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const Discord = require("discord.js-light");
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
  // client: new Client({
  //   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions],
  //   partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  // }),
  client: new Discord.Client({
    // default caching options, feel free to copy and modify. more info on caching options below.
    makeCache: Discord.Options.cacheWithLimits({
      ApplicationCommandManager: 0, // guild.commands
      BaseGuildEmojiManager: 0, // guild.emojis
      ChannelManager: 0, // client.channels
      GuildChannelManager: 0, // guild.channels
      GuildBanManager: 0, // guild.bans
      GuildInviteManager: 0, // guild.invites
      GuildManager: Infinity, // client.guilds
      GuildMemberManager: 0, // guild.members
      GuildStickerManager: 0, // guild.stickers
      GuildScheduledEventManager: 0, // guild.scheduledEvents
      MessageManager: 0, // channel.messages
      PermissionOverwriteManager: 0, // channel.permissionOverwrites
      PresenceManager: 0, // guild.presences
      ReactionManager: 0, // message.reactions
      ReactionUserManager: 0, // reaction.users
      RoleManager: 0, // guild.roles
      StageInstanceManager: 0, // guild.stageInstances
      ThreadManager: 0, // channel.threads
      ThreadMemberManager: 0, // threadchannel.members
      UserManager: 0, // client.users
      VoiceStateManager: 0, // guild.voiceStates
    }),
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      // Discord.Intents.FLAGS.GUILD_MEMBERS,
      // Discord.Intents.FLAGS.GUILD_MESSAGES,
      // Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      // Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
      Discord.Intents.FLAGS.DIRECT_MESSAGES,
      Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      // Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
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
      this.client.on("ready", (c) => {
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

// botInterface.client.once('ready')
botInterface.client.on("ready", (c) => {
  botId = c.user.id;
  console.info(`Ready! Logged in as ${c.user.tag} with ID ${c.user.id}`);
  botInterface.emit("ready", null);
});

botInterface.client.on("messageCreate", (msg) => {
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
