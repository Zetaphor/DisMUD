import setupBotInterface from "./bot/interface";
import { db } from "./db/init";
import players from "./state/players";
import msgAuthenticated from "./msgAuthenticated";
import msgUnauthenticated from "./msgUnauthenticated";
import systemMessages from "./messages/system";
import simulation from "./simulation/world";
import inventories from "./state/inventories";

const worldState = {
  db,
  players,
  simulation,
  inventories,
};

async function startup() {
  try {
    simulation.start();

    await db.init();
    console.log("Databases loaded...");

    const botInterface = setupBotInterface();
    await botInterface.waitForEvent("ready");

    systemMessages.notifyOnline(botInterface.client);

    botInterface.on("playerMsg", (msg) => {
      if (!players.isActive(msg.user.id)) msgUnauthenticated(worldState, msg);
      else msgAuthenticated(worldState, msg);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
}

startup();
