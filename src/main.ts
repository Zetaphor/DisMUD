import setupBotInterface from "./bot/interface";
import { db } from "./db/init";
import players from "./players";
import handleAuthenticatedMessages from "./messages/handleAuthenticated";
import unauthenticatedMessage from "./messages/handleUnauthenticated";
import systemMessages from "./messages/system";
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
      if (!players.isActive(msg.user.id)) unauthenticatedMessage(players, db, simulation, msg);
      else handleAuthenticatedMessages(players, db, simulation, msg);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
}

startup();
