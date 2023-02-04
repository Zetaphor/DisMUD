import systemMessages from "./bot/systemMessages";

export default function unauthenticatedMessage(players, db, msg) {
  if (msg.content.toLowerCase() === "login") {
    players
      .login(db["players"], msg.user)
      .then((newPlayer) => {
        if (newPlayer) systemMessages.newPlayer(msg.user);
        else systemMessages.loggedIn(msg.user);
      })
      .catch((err) => {
        console.log(`Failed to login ${msg.user.username}`, err);
        systemMessages.loginFailed(msg.user);
      });
  } else {
    systemMessages.newSession(msg.user);
  }
}
