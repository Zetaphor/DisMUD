export default function say(worldState, userData, msg) {
  console.info(`${userData.user.username} emotes: ${msg.join(" ")}`);
}
