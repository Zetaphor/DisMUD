import systemMessages from "./bot/systemMessages";

export default async function unauthenticatedMessage(players, db, simulation, msg) {
  if (msg.content.toLowerCase() === "login") {
    try {
      const newPlayer = await players.login(db["players"], simulation, msg.user);
      if (newPlayer) systemMessages.newPlayer(msg.user);
      else systemMessages.loggedIn(msg.user);
      // TODO: Send the first world update message
    } catch (err) {
      console.log(`Failed to login ${msg.user.username}`, err);
      systemMessages.loginFailed(msg.user);
      players.logout();
      simulation.removePlayerEntity();
    }
  } else {
    systemMessages.newSession(msg.user);
  }
}
