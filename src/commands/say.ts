export default function say(simulation, userData, message) {
  console.log(`${userData.user.username} says: ${message.join(" ")}`);
}
