import emoji from "../messages/emoji";
import itemConstants from "../messages/itemConstants";
import buildRoom from "../roomBuilder";

export default async function look(worldState, userData, msg) {
  try {
    if (msg[0] === "look") {
      const roomData = await worldState.rooms.getEntityRoomData(
        worldState.db["rooms"],
        worldState.simulation.world,
        userData.eid
      );
      buildRoom(worldState, userData.user, userData.eid, roomData, userData.admin, userData.userPrefs.autoExits, false);
    } else {
      let moveDir = "";
      if (msg[0] === "n" || msg[0] === "north") {
        moveDir = "north";
      } else if (msg[0] === "s" || msg[0] === "south") {
        moveDir = "south";
      } else if (msg[0] === "e" || msg[0] === "east") {
        moveDir = "east";
      } else if (msg[0] === "w" || msg[0] === "west") {
        moveDir = "west";
      } else if (msg[0] === "u" || msg[0] === "up") {
        moveDir = "up";
      } else if (msg[0] === "d" || msg[0] === "down") {
        moveDir = "down";
      }

      const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);

      if (moveDir !== "") {
        // Look move direction
        const roomExits = await worldState.rooms.getRoomExits(worldState.db["rooms"], roomNum);
        if (roomExits[moveDir] && roomExits[moveDir]["desc"].length) {
          userData.sendMessage(userData.user, `${emoji.binoculars} _${roomExits[moveDir]["desc"]}_`);
          return;
        } else {
          userData.sendMessage(userData.user, `${emoji.blind} _You can't see anything in that direction._`);
          return;
        }
      } else {
        const target = await worldState.rooms.targetAlias(worldState, userData.id, roomNum, true, true, true, msg[0]);

        if (target.type === "") {
          userData.sendMessage(userData.user, `${emoji.question} _You do not see that here._`);
        } else if (target.type === "inventory") {
          let itemTitle = `${emoji.examine} **${worldState.utils.capitalizeFirst(
            target.data.shortDesc
          )}** _(In Inventory)_\n`;
          userData.sendMessage(
            userData.user,
            `
            ${itemTitle}${itemConstants.types[target.data.type]}
          `
          );
          worldState.broadcasts.sendToRoom(
            worldState,
            roomNum,
            userData.eid,
            false,
            `${emoji.eye} _${userData.displayName} looks at an object in their inventory._`
          );
        } else if (target.type === "item") {
          let itemTitle = `${emoji.examine} **${worldState.utils.capitalizeFirst(target.data.shortDesc)}**\n`;
          userData.sendMessage(
            userData.user,
            `
            ${itemTitle}${itemConstants.types[target.data.type]}
          `
          );
          worldState.broadcasts.sendToRoom(
            worldState,
            roomNum,
            userData.eid,
            false,
            `${emoji.eye} _${userData.displayName} looks at ${target.data.shortDesc}._`
          );
        } else if (target.type === "mob") {
          userData.sendMessage(
            userData.user,
            `
              ${emoji.examine} _You look at ${target.data.shortDesc}_\n
              ${target.data.detailedDesc}
            `
          );
          worldState.broadcasts.sendToRoom(
            worldState,
            roomNum,
            userData.eid,
            false,
            `${emoji.eye} _${userData.displayName} looks at ${target.data.shortDesc}._`
          );
        }
      }
    }
  } catch (err) {
    console.error(`Error using look ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
