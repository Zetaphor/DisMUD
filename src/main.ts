import db from "./db/init";
import setupBotInterface from "./bot/interface";
import simulation from "./simulation/world";
import msgAuthenticated from "./msgAuthenticated";
import msgUnauthenticated from "./msgUnauthenticated";
import systemMessages from "./messages/system";
import players from "./state/players";
import inventories from "./state/inventories";
import items from "./state/items";
import rooms from "./state/rooms";
import mobs from "./state/mobs";

const worldState = {
  db,
  players,
  simulation,
  inventories,
  items,
  rooms,
  mobs,
};

async function startup() {
  try {
    simulation.start();

    await db.init();
    console.info("Databases loaded...");

    const botInterface = setupBotInterface();
    await botInterface.waitForEvent("ready");

    systemMessages.notifyOnline(botInterface.client);

    botInterface.on("playerMsg", (msg) => {
      if (!players.isActiveDiscordId(BigInt(msg.user.id))) msgUnauthenticated(worldState, msg);
      else msgAuthenticated(worldState, msg);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
}

startup();
