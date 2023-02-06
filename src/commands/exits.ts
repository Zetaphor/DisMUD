import emoji from "../messages/emoji";

export default async function move(worldState, userData, msg) {
  const roomExits = Object.keys(await worldState.simulation.getPlayerRoomExits(userData.eid));
  userData.user.send(
    `${emoji.directions} _You can see an exit in the following directions:_ **${roomExits.join(", ")}**`
  );
}
