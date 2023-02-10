import emoji from "../messages/emoji";
import itemConstants from "../messages/itemConstants";

export default async function examine(worldState, userData, msg) {
  const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
  let target = await worldState.rooms.targetAlias(worldState, userData.id, roomNum, true, true, true, msg[0]);

  if (target.type === "") {
    userData.user.send(`${emoji.question} _You do not see that here._`);
  } else if (target.type === "inventory") {
    let itemTitle = `${emoji.examine} **${
      target.data.shortDesc.charAt(0).toUpperCase() + target.data.shortDesc.slice(1)
    }** _(In Inventory)_\n`;

    let extras = "";
    for (let i = 0; i < target.data.extra.length; i++) {
      extras += itemConstants.effects[target.data.extra[i]] + "\n";
    }

    userData.user.send(`
      ${itemTitle}
      ${emoji.coins} Value: ${target.data.cost}
      ${itemConstants.types[target.data.type]}
      ${extras.slice(0, -2)}
      ${itemConstants.wear[Number(target.data.wear) - 1]}
    `);

    worldState.broadcasts.sendToRoom(
      worldState,
      roomNum,
      userData.eid,
      true,
      `${emoji.examine} _${userData.displayName} closely examines an object in their inventory._`
    );
  } else if (target.type === "item") {
    if (!Number(userData.admin)) {
      userData.user.send(`${emoji.error} _You need to be holding that in order to examine it more closely!_`);
      return;
    }

    let itemTitle = `${emoji.examine} **${
      target.data.shortDesc.charAt(0).toUpperCase() + target.data.shortDesc.slice(1)
    }**\n`;

    let extras = "";
    for (let i = 0; i < target.data.extra.length; i++) {
      extras += itemConstants.effects[target.data.extra[i]] + "\n";
    }

    userData.user.send(`
      ${itemTitle}
      ${emoji.coins} Value: ${target.data.cost}
      ${itemConstants.types[target.data.type]}
      ${extras.slice(0, -2)}
      ${itemConstants.wear[Number(target.data.wear) - 1]}
    `);
    worldState.broadcasts.sendToRoom(
      worldState,
      roomNum,
      userData.eid,
      true,
      `${emoji.examine} _${userData.displayName} closely examines ${target.data.shortDesc}._`
    );
  } else if (target.type === "mob") {
    userData.user.send(`
        ${emoji.examine} _You look at ${target.data.shortDesc}_\n
        ${target.data.detailedDesc}
      `);
    worldState.broadcasts.sendToRoom(
      worldState,
      roomNum,
      userData.eid,
      true,
      `${emoji.examine} _${userData.displayName} closely examines ${target.data.shortDesc}._`
    );
  }
}
