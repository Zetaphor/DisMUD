import emoji from "../messages/emoji";
import itemConstants from "../messages/itemConstants";

export default function equipment(worldState, userData, msg) {
  try {
    let equipmentStrings = [];
    for (const id in userData.equipment) {
      if (Object.prototype.hasOwnProperty.call(userData.equipment, id)) {
        const item = userData.equipment[id];
        console.log(item.type);
        equipmentStrings.push(
          `${itemConstants.equipEmoji[item.type]} ${item.shortDesc} - ${itemConstants.wear_messages[id]}`
        );
      }
    }

    userData.user.send(
      `${emoji.swordShield} **__${equipmentStrings.length} Items Currently Equipped__**\n\n${equipmentStrings.join(
        "\n"
      )}`
    );
  } catch (err) {
    console.error(`Error using equipment ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
