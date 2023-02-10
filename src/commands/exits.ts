import emoji from "../messages/emoji";

export default async function move(worldState, userData, msg) {
  const roomExits = Object.keys(
    await worldState.rooms.getEntityRoomExits(worldState.db["rooms"], worldState.simulation.world, userData.eid)
  );
  userData.user.send(
    `${emoji.directions} _You can see an exit in the following directions:_ **${roomExits.join(", ")}**`
  );
}
