import { getRecord, initDb } from "./util";

const dbPath = "src/databases/rooms.db";

let roomsDBConn = null;

const createRoomsTable = `
CREATE TABLE IF NOT EXISTS Rooms (
  id INTEGER PRIMARY KEY,
  vNum INTEGER UNIQUE,
  name TEXT,
  data TEXT,
  created TEXT DEFAULT (datetime('now', 'utc')),
  lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
)
`;

const createRoomIndexes = `CREATE INDEX idx_vNum ON Rooms (vNum)`;

const roomsMethods = {
  getRoomData: (vnum: BigInt) => getRecord(roomsDBConn, "Rooms", "vnum", vnum),
};

/**
 * Initializes the rooms database.
 * @returns {Promise} A promise that resolves to an object containing the database connection and methods.
 */
export default function initRoomsDb() {
  return new Promise(async (resolve, reject) => {
    try {
      const roomsDBObject = await initDb(dbPath, "Rooms", createRoomsTable, createRoomIndexes);
      roomsDBObject["methods"] = roomsMethods;
      roomsDBConn = roomsDBObject["conn"];
      resolve(roomsDBObject);
    } catch (err) {
      console.error(`Error initializing rooms database: ${err}`);
      reject(err);
    }
  });
}
