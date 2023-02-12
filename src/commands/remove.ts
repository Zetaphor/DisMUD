import emoji from "../messages/emoji";

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
      userData.user.send(`${emoji.check} _You removed ${matchedItem.shortDesc}._`);
    } else {
      userData.user.send(`${emoji.question} _You're not wearing anything with that name_`);
    }
  } catch (err) {
    console.error(`Error using remove ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
