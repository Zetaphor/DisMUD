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
import zones from "./state/zones";
import timedStateFunctions from "./state/timedStateFunctions";
import broadcasts from "./state/broadcasts";
import { containsBannedWord, stripString } from "./util/wordFilter";
import capitalizeFirst from "./util/capitalizeFirst";

const worldState = {
  db,
  players,
  simulation,
  timedStateFunctions,
  inventories,
  items,
  rooms,
  mobs,
  zones,
  broadcasts,
  utils: {
    containsBannedWord,
    stripString,
    capitalizeFirst,
  },
};

async function startup() {
  try {
    simulation.start();

    worldState.rooms.setupQueries(worldState.simulation.world);

    await db.init();
    console.info("Databases loaded...");

    await worldState.zones.loadZones(worldState);
    console.info("Zones loaded...\n");

    const botInterface = setupBotInterface();
    await botInterface.waitForEvent("ready");

    timedStateFunctions.setupTimedStateFunctions(worldState);

    systemMessages.notifyOnline(botInterface.client);

    botInterface.on("playerMsg", (msg) => {
      if (!players.isActiveDiscordId(`k${msg.user.id}`)) msgUnauthenticated(worldState, msg);
      else msgAuthenticated(worldState, msg);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
}

startup();
