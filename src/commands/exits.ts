export default async function move(simulation, userData, msg) {
  const roomExits = Object.keys(await simulation.getPlayerRoomExits(userData.eid));
  userData.user.send(`🗺️ _You can see an exit in the following directions: **${roomExits.join(", ")}**_`);
}
