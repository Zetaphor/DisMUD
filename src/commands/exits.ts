import emoji from "../messages/emoji";

export default async function move(worldState, userData, msg) {
  try {
    const roomExits = Object.keys(
      await worldState.rooms.getEntityRoomExits(worldState.db["rooms"], worldState.simulation.world, userData.eid)
    );
    userData.sendMessage(
      `${emoji.directions} _You can see an exit in the following directions:_ **${roomExits.join(", ")}**`
    );
  } catch (err) {
    console.error(`Error using move ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
