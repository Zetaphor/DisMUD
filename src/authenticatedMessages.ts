import systemMessages from "./bot/systemMessages";

export default function authenticatedMessage(players, db, msg) {
  if (msg.content.toLowerCase() === "logout" || msg.content.toLowerCase() === "quit") {
    players.logout(msg.user);
    systemMessages.logout(msg.user);
  } else if (msg.content.toLowerCase() === "login") {
    systemMessages.alreadyLoggedIn(msg.user);
  } else {
    console.log("Handle player commands here");
  }
}
