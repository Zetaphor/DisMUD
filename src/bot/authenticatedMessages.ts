import systemMessages from "./systemMessages";

export default function authenticatedMessage(players, db, msg) {
  if (msg.content === "logout" || msg.content === "quit") {
    players.logout(db["players"], msg.user);
    systemMessages.logout(msg.user);
  } else if (msg.content === "login") {
    systemMessages.alreadyLoggedIn(msg.user);
  } else {
    console.log("Handle player commands here");
  }
}
