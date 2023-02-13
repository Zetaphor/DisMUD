import emoji from "../messages/emoji";
import itemConstants from "../messages/itemConstants";

export default async function remove(worldState, userData, msg) {
  try {
    let matchedSlot = null;
    let matchedItem = null;
    for (const id in userData.equipment) {
      if (Object.prototype.hasOwnProperty.call(userData.equipment, id)) {
        for (let i = 0; i < userData.equipment[id].aliases.length; i++) {
          if (userData.equipment[id].aliases[i] === msg[0]) {
            matchedSlot = id;
            matchedItem = userData.equipment[id];
            i = userData.equipment[id].aliases.length;
            break;
          }
        }
      }
    }

    if (matchedSlot !== null && matchedItem !== null) {
      await worldState.inventories.giveItem(userData.id, matchedItem, 1);
      delete userData.equipment[matchedSlot];
      userData.sendMessage(
        userData.user,
        `${emoji.check} _You removed the ${matchedItem.shortDesc} you were had ${itemConstants.slot_names[matchedSlot]}.._`
      );
    } else {
      userData.sendMessage(userData.user, `${emoji.question} _You're not wearing anything with that name_`);
    }
  } catch (err) {
    console.error(`Error using remove ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
