import authenticatedMessage from "./bot/authenticatedMessages";
import setupBotInterface from "./bot/interface";
import players from "./bot/players";
import systemMessages from "./bot/systemMessages";
import unauthenticatedMessage from "./bot/unauthenticatedMessages";
import { db } from "./db/init";

async function startup() {
  try {
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
