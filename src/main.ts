import setupBotInterface from "./bot/interface";
import { db } from "./db/init";
import players from "./players";
import authenticatedMessage from "./authenticatedMessages";
import unauthenticatedMessage from "./unauthenticatedMessages";
import systemMessages from "./bot/systemMessages";
import simulation from "./simulation/world";

async function startup() {
  try {
    simulation.start();

    await db.init();
    console.log("Databases loaded...");

    const botInterface = setupBotInterface();
    await botInterface.waitForEvent("ready");

    systemMessages.notifyOnline(botInterface.client);

    botInterface.on("playerMsg", (msg) => {
      if (!players.checkActive(msg.user.id)) unauthenticatedMessage(players, db, msg);
      else authenticatedMessage(players, db, msg);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
}

startup();
