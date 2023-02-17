import emoji from "../messages/emoji";

export default async function move(worldState, userData, msg) {
  try {
    const roomExits = Object.keys(
      await worldState.rooms.getEntityRoomExits(worldState.db["rooms"], worldState.simulation.world, userData.eid)
    );
    if (!roomExits.length) userData.sendMessage(userData.user, `${emoji.directions} _You don't see an exit anywhere!_`);
    else
      userData.sendMessage(
        userData.user,
        `${emoji.directions} _You can see an exit in the following directions:_ **${roomExits.join(", ")}**`
      );
  } catch (err) {
    console.error(`Error using exits ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
