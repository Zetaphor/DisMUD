export default function say(simulation, userData, msg) {
  console.log(`${userData.user.username} says: ${msg.join(" ")}`);
}
