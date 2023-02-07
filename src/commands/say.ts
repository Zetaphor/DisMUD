export default function say(worldState, userData, msg) {
  console.log(`${userData.user.username} says: ${msg.join(" ")}`);
}
