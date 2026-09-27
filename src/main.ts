import { createWorldState, initializeWorldState } from "./bootstrap/worldState";
import setupBotInterface from "./bot/interface";
import msgAuthenticated from "./msgAuthenticated";
import msgUnauthenticated from "./msgUnauthenticated";
import systemMessages from "./messages/system";
import players from "./state/players";
import logger from "./util/logger";

const worldState = createWorldState();

async function startup() {
  try {
    initializeWorldState(worldState);

    const botInterface = setupBotInterface();
    await botInterface.waitForEvent("ready");

    systemMessages.notifyOnline(botInterface.client);

    botInterface.on("playerMsg", (msg) => {
      if (!players.isActiveDiscordId(`k${msg.user.id}`)) msgUnauthenticated(worldState, msg);
      else msgAuthenticated(worldState, msg);
    });
  } catch (err) {
    logger.error({ err }, "Startup error");
  }
}

startup();
