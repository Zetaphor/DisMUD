import setupBotInterface from "./bot/interface";
import { db } from "./db/init";
import players from "./players";
import authenticatedMessage from "./authenticatedMessages";
import unauthenticatedMessage from "./unauthenticatedMessages";
import systemMessages from "./bot/systemMessages";
import simulation from "./simulation/world";

async function startup() {
  try {
    simulation.start();

    await db.init();
    console.log("Databases loaded...");

    const botInterface = setupBotInterface();
    await botInterface.waitForEvent("ready");

    systemMessages.notifyOnline(botInterface.client);

    botInterface.on("playerMsg", (msg) => {
      if (!players.checkActive(msg.user.id)) unauthenticatedMessage(players, db, msg);
      else authenticatedMessage(players, db, msg);
    });

    // db["players"].createPlayer({
    //   discordId: 134317574342180864n,
    //   discordUsername: "Zetaphor#0237",
    //   displayName: "Zetaphor",
    //   roomNum: 18600,
    // });

    // db["players"].setPlayerName(134317574342180864n, "Zetaphor");
    // db["players"].setPlayerEnabled(134317574342180864n, true);
  } catch (err) {
    console.error("Startup error:", err);
  }
}

startup();
