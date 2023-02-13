import emoji from "../messages/emoji";

export default async function give(worldState, userData, msg) {
  return new Promise(async (resolve, reject) => {
    try {
      const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
      const roomUsers = worldState.rooms.getPlayersInRoom(worldState.simulation.world, roomNum);

      let targetIsPlayer = false;

      let targetName = "";
      let giveQty = 1;
      let targetItem = "";
      if (/^-?\d+(\.\d+)?$/.test(msg[0])) {
        giveQty = Number(msg[0]);
        targetItem = msg[1].toLowerCase();
        targetName = msg[2].toLowerCase();
      } else {
        targetItem = msg[0].toLowerCase();
        targetName = msg[1].toLowerCase();
      }

      // console.info(`targetItem: ${targetItem} targetName: ${targetName} giveQty: ${giveQty}`);

      let giveTarget = null;

      for (let i = 0; i < roomUsers.length; i++) {
        const player = worldState.players.getActiveByEntityId(roomUsers[i]);
        if (player.displayName.toLowerCase().includes(targetName)) {
          giveTarget = player;
          targetIsPlayer = true;
          i = roomUsers.length;
        }
      }

      if (giveTarget === null) {
        const target = await worldState.rooms.targetAlias(
          worldState,
          userData.id,
          roomNum,
          false,
          false,
          true,
          targetName
        );

        if (target.type === "") {
          userData.user.send(`${emoji.error} _That person is not here with you!_`);
          resolve(false);
          return;
        } else if (target.type === "mob") {
          giveTarget = target.data;
          targetIsPlayer = false;
        }
      }

      const inventoryAliases = await worldState.inventories.getInventoryAliases(userData.id);
      let matchedItem = null;
      for (const id in inventoryAliases) {
        if (Object.prototype.hasOwnProperty.call(inventoryAliases, id)) {
          if (inventoryAliases[id].indexOf(targetItem.toLowerCase()) !== -1) {
            matchedItem = id;
            break;
          }
        }
      }
      if (matchedItem !== null) {
        const item = await worldState.inventories.getInventoryItem(userData.id, matchedItem);

        if (item.qty < giveQty) {
          userData.user.send(`${emoji.error} You don't have enough of that!`);
          resolve(false);
          return;
        }

        if (!targetIsPlayer) {
          if (worldState.mobs.mobHasItem(giveTarget.id, item.id)) {
            worldState.mobs.updateMobItemQty(giveTarget.id, item.id, giveQty);
          } else worldState.mobs.giveMobItem(giveTarget.id, item, giveQty);

          // Remove the quantity from the givers inventory
          worldState.inventories.updateQuanity(userData.id, item.data.id, 0 - giveQty);

          userData.user.send(
            `${emoji.give} _You given ${giveQty} of \`${item.data.shortDesc}\` to ${giveTarget.shortDesc}._`
          );
          worldState.broadcasts.sendToRoom(
            worldState,
            roomNum,
            userData.eid,
            false,
            `_${emoji.give} ${userData.displayName} gave something to ${giveTarget.shortDesc}._`
          );
        } else {
          const targetHasItem = await worldState.inventories.hasItem(giveTarget.id, item.data.id);
          if (targetHasItem) {
            worldState.inventories.updateQuanity(giveTarget.id, item.data.id, giveQty);
          } else {
            worldState.inventories.giveItem(giveTarget.id, item.data, giveQty);
          }

          // Remove the quantity from the givers inventory
          worldState.inventories.updateQuanity(userData.id, item.data.id, 0 - giveQty);

          userData.user.send(
            `${emoji.give} _You given ${giveQty} of \`${item.data.shortDesc}\` to ${giveTarget.displayName}._`
          );
          worldState.broadcasts.sendToRoom(
            worldState,
            roomNum,
            userData.eid,
            false,
            `_${emoji.give} ${userData.displayName} gave something to ${giveTarget.displayName}._`
          );
          worldState.broadcasts.sendToPlayer(
            worldState,
            giveTarget.eid,
            `_${emoji.give} ${userData.displayName} gave you ${giveQty} ${item.data.shortDesc}._`
          );
          resolve(true);
        }
      } else userData.user.send(`${emoji.question} _You don't have an item with that name_`);
    } catch (err) {
      console.error(`Error using give ${msg}: ${err}`);
      userData.user.send(`${emoji.error} _Something went wrong!_`);
      reject();
    }
  });
}
