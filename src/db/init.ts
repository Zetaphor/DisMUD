import initPlayerInventoriesDb from "./inventories";
import initObjectsDb from "./objects";
import initMobsDb from "./mobs";
import initPlayersDb from "./players";
import initRoomsDb from "./rooms";
import initZonesDb from "./zones";

let databases = [];

/**
 * Initializes all databases and stores them in the databases object
 * @returns {Boolean} Returns true if successful, otherwise throws an error
 */
async function initDatabases() {
  try {
    db["players"] = await initPlayersDb();
    db["playerInventories"] = await initPlayerInventoriesDb();
    db["mobs"] = await initMobsDb();
    db["objects"] = await initObjectsDb();
    db["rooms"] = await initRoomsDb();
    db["zones"] = await initZonesDb();
    return true;
  } catch (err) {
    console.error("Database initialize:", err);
  }
}

export const db = {
  init: initDatabases,
  close() {
    for (let dbName in Object.keys(this)) {
      if (databases.hasOwnProperty(dbName) && dbName !== "init" && dbName !== "close") {
        databases[dbName]["conn"].close();
      }
    }
  },
};

export default db;
