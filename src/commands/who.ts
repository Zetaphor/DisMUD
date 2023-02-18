import emoji from "../messages/emoji";

export default async function who(worldState, userData, msg) {
  try {
    let playersData = Object.values(worldState.players.currentActive);
    let playerList = [];
    for (let i = 0; i < playersData.length; i++) {
      let playerString = `${playersData[i]["displayName"]}`;
      if (playersData[i]["userPrefs"]["discordId"]) playerString += ` (${playersData[i]["discordUsername"]})`;
      if (playersData[i]["admin"]) playerString += ` **(ADMIN)**`;
      playerList.push(playerString);
    }
    userData.sendMessage(
      userData.user,
      `${emoji.book} **__${playerList.length} Players Currently Online__** ${emoji.sparkles}\n\n${playerList.join(
        "\n"
      )}`
    );
  } catch (err) {
    console.error(`Error using who ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
