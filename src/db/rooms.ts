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

const createRoomIndexes = `CREATE INDEX IF NOT EXISTS idx_vNum ON Rooms (vNum)`;

const roomsMethods = {
  getRoomData: (vnum) => getRecord(roomsDBConn, "Rooms", "vnum", vnum),
};

export default function initRoomsDb() {
  const roomsDBObject = initDb(dbPath, "Rooms", createRoomsTable, createRoomIndexes);
  roomsDBObject["methods"] = roomsMethods;
  roomsDBConn = roomsDBObject["conn"];
  return roomsDBObject;
}
