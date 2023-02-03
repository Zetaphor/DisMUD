import initPlayersDb from "./players";

let databases = {};

async function initDatabases() {
  try {
    databases["players"] = await initPlayersDb();
    db["players"] = databases["players"]["methods"];
    return true;
  } catch (err) {
    console.error("Database initialize:", err);
  }
}

export const db = {
  init: initDatabases,
  close: () => {
    for (let dbName in databases) {
      if (databases.hasOwnProperty(dbName)) {
        databases[dbName].close();
      }
    }
  },
};

export default db;
