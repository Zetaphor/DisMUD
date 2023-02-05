import initPlayersDb from "./players";

let databases = {};

/**
 * Initializes all databases and stores them in the databases object
 * @returns {Boolean} Returns true if successful, otherwise throws an error
 */
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
