require("dotenv").config();

import logger from "../util/logger";
import { createDiscordSessionUser } from "../io/sessionAdapter";

const { EventEmitter } = require("events");
const { Client, GatewayIntentBits, Partials, Options } = require("discord.js");
const token = process.env.DISCORD_TOKEN;

let botId: string | null = null;

class BotInterface extends EventEmitter {
  client: any;

  constructor() {
    super();
    this.client = new Client({
      makeCache: Options.cacheWithLimits({
        ApplicationCommandManager: 0,
        BaseGuildEmojiManager: 0,
        GuildBanManager: 0,
        GuildInviteManager: 0,
        GuildManager: Infinity,
        GuildMemberManager: 0,
        GuildStickerManager: 0,
        GuildScheduledEventManager: 0,
        MessageManager: 0,
        PermissionOverwriteManager: 0,
        PresenceManager: 0,
        ReactionManager: 0,
        ReactionUserManager: 0,
        RoleManager: 0,
        StageInstanceManager: 0,
        ThreadManager: 0,
        ThreadMemberManager: 0,
        UserManager: 0,
        VoiceStateManager: 0,
      }),
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  }

  async getUser(id) {
    try {
      return await this.client.users.fetch(id.toString());
    } catch (err) {
      logger.error({ err }, `Failed to get user ${id}`);
      throw err;
    }
  }

  waitForEvent(event) {
    return new Promise((resolve) => {
      this.client.once("ready", () => {
        resolve(event);
      });
    });
  }
}

const botInterface = new BotInterface();

botInterface.client.on("ready", (c) => {
  botId = c.user.id;
  logger.info(`Ready! Logged in as ${c.user.tag} with ID ${c.user.id}`);
  botInterface.emit("ready");
});

botInterface.client.on("messageCreate", (msg) => {
  if (msg.author.id === botId) return;
  botInterface.emit("playerMsg", {
    user: createDiscordSessionUser(msg.author),
    content: msg.content,
  });
});

export default function setupBotInterface() {
  logger.info("Starting bot...");
  botInterface.client.login(token);
  return botInterface;
}
