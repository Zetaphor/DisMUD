import setupBotInterface from "./bot/interface";
import players from "./bot/players";
import systemMessages from "./bot/system-messages";
import menuMessages from "./bot/menu-messages";
import { db } from "./db/init";

async function startup() {
  try {
    await db.init();
    console.log("Databases loaded...");

    const botInterface = setupBotInterface();
    await botInterface.waitForEvent("ready");

    systemMessages.notifyOnline(botInterface.client);

    botInterface.on("playerMsg", (msg) => {
      if (!players.checkActive(msg.user.id)) menuMessages.newSession(msg.user);
      else if (msg.content === "login") {
        players.login(db["players"], msg.user);
      } else if (msg.content === "logout" || msg.content === "quit") {
        if (!players.checkActive(msg.user.id)) menuMessages.alreadyLoggedout(msg.user);
        else {
          players.logout(db["players"], msg.user);
          menuMessages.logout(msg.user);
        }
      } else {
        console.log("Handle player commands here");
      }
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
