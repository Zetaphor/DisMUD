import emoji from "../messages/emoji";

export default async function who(worldState, userData, msg) {
  try {
    let playersData = Object.values(worldState.players.currentActive);
    let playerList = [];
    for (let i = 0; i < playersData.length; i++) {
      playerList.push(`${playersData[i]["displayName"]} _(${playersData[i]["discordUsername"]})_`);
    }
    userData.user.send(
      `${emoji.book} **__${playerList.length} Players Currently Online__** ${emoji.sparkles}\n\n${playerList.join(
        "\n"
      )}`
    );
  } catch (err) {
    console.error(`Error using who ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
