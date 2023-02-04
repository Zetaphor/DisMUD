import systemMessages from "./bot/systemMessages";

export default async function authenticatedMessage(players, db, simulation, msg) {
  if (msg.content.toLowerCase() === "logout" || msg.content.toLowerCase() === "quit") {
    try {
      await players.logout(players, simulation, msg.user);
      systemMessages.logout(msg.user);
    } catch (err) {
      console.error(`Error logging out user ${msg.user.id}`);
      systemMessages.logoutFailed(msg.user);
    }
  } else if (msg.content.toLowerCase() === "login") {
    systemMessages.alreadyLoggedIn(msg.user);
  } else {
    console.log("Handle player commands here");
  }
}
