import { db } from "./db/init";

async function start() {
  try {
    const databasesReady = await db.init();
    console.log("Databases ready:", databasesReady);

    // db["players"].createPlayer({
    //   discordId: 134317574342180864n,
    //   discordUsername: "Zetaphor#0237",
    //   displayName: "Zetaphor",
    //   roomNum: 18600,
    // });

    db["players"].setPlayerName(134317574342180864n, "Zetaphor");
    // db["players"].setPlayerEnabled(134317574342180864n, true);
  } catch (err) {
    console.error("Startup error:", err);
  }
}

start();
