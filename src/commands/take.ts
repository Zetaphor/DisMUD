import emoji from "../messages/emoji";

export default async function take(worldState, userData, msg) {
  try {
    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);

    if (msg[0] === "all") {
      const roomItems = worldState.rooms.getItemsInRoom(worldState.simulation.world, roomNum);
      for (let i = 0; i < roomItems.length; i++) {
        const roomItemData = {
          eid: roomItems[i],
          data: worldState.items.getActiveItemData(roomItems[i]),
        };
        takeItem(worldState, userData, roomNum, roomItemData);
      }
    } else {
      const target = await worldState.rooms.targetAlias(worldState, userData.id, roomNum, true, false, false, msg[0]);

      if (target.type === "") {
        userData.user.send(`${emoji.question} _You do not see that here._`);
      } else {
        takeItem(worldState, userData, roomNum, target);
      }
    }
  } catch (err) {
    console.error(`Error using take ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}

async function takeItem(worldState, userData, roomNum, target) {
  try {
    await worldState.inventories.giveItem(userData.id, target.data, 1);
    await worldState.items.removeItem(worldState, target.eid);
    userData.user.send(`${emoji.grab} _You picked up ${target.data.shortDesc}_ and put it in your inventory.`);
    worldState.broadcasts.sendToRoom(
      worldState,
      roomNum,
      userData.eid,
      false,
      `${emoji.grab} _${userData.displayName} picked up ${target.data.shortDesc}._`
    );
  } catch (err) {
    console.error(`Error using takeItem ${target}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
