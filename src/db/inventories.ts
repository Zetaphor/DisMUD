import { createRecord, getRecord, initDb, removeRecord, updateRecord } from "./util";

const dbPath = "src/databases/playerInventories.db";

let playerInventoriesDBConn = null;

const createPlayerInventoriesTable = `
CREATE TABLE IF NOT EXISTS PlayerInventories (
  id INTEGER PRIMARY KEY,
  playerId INTEGER UNIQUE,
  inventoryString TEXT,
  lastSaved TEXT DEFAULT (datetime('now', 'utc'))
)
`;

const createPlayerInventoryIndexes = `CREATE INDEX IF NOT EXISTS idx_playerId ON PlayerInventories (playerId);`;

const playerInventoryMethods = {
  getPlayerInventory: (id) => getRecord(playerInventoriesDBConn, "PlayerInventories", "playerId", id),
  initPlayerInventory(id) {
    const newInventoryId = createRecord(playerInventoriesDBConn, "PlayerInventories", {
      playerId: id,
      inventoryString: "",
    });
    return getRecord(playerInventoriesDBConn, "PlayerInventories", "id", newInventoryId);
  },
  removePlayerInventory: (id) => removeRecord(playerInventoriesDBConn, "PlayerInventories", id),
  savePlayerInventory: (id, inventory) =>
    updateRecord(
      playerInventoriesDBConn,
      "PlayerInventories",
      {
        playerId: id,
        inventoryString: encodeURIComponent(JSON.stringify(inventory)),
        lastSaved: new Date().toISOString().slice(0, 19).replace("T", " "),
      },
      "playerId",
      id
    ),
};

export default function initPlayerInventoriesDb() {
  const playerInventoriesDBObject = initDb(
    dbPath,
    "PlayerInventories",
    createPlayerInventoriesTable,
    createPlayerInventoryIndexes
  );
  playerInventoriesDBObject["methods"] = playerInventoryMethods;
  playerInventoriesDBConn = playerInventoriesDBObject["conn"];
  return playerInventoriesDBObject;
}
