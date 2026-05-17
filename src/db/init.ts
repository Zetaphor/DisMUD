import initPlayerInventoriesDb from "./inventories";
import initItemsDb from "./items";
import initMobsDb from "./mobs";
import initPlayersDb from "./players";
import initRoomsDb from "./rooms";
import initZonesDb from "./zones";

function initDatabases() {
  db["players"] = initPlayersDb();
  db["playerInventories"] = initPlayerInventoriesDb();
  db["mobs"] = initMobsDb();
  db["items"] = initItemsDb();
  db["rooms"] = initRoomsDb();
  db["zones"] = initZonesDb();
  return true;
}

export const db = {
  init: initDatabases,
  close() {
    for (const dbName of Object.keys(this)) {
      if (dbName !== "init" && dbName !== "close" && this[dbName]?.conn) {
        this[dbName].conn.close();
      }
    }
  },
};

export default db;
