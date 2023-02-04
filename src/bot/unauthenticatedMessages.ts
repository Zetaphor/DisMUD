import systemMessages from "./systemMessages";

export default function unauthenticatedMessage(players, db, msg) {
  if (msg.content === "login") {
    players
      .login(db["players"], msg.user)
      .then(() => {
        systemMessages.loggedIn(msg.user);
      })
      .catch((err) => {
        console.log(`Failed to login ${msg.user.username}`, err);
        systemMessages.loginFailed(msg.user);
      });
  } else {
    systemMessages.newSession(msg.user);
  }
}
