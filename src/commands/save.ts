import emoji from "../messages/emoji";

export default async function save(worldState, userData, msg) {
  try {
    await worldState.players.save(worldState, userData);
    userData.user.send(`${emoji.check} _Your character has been saved. You can now safely logout_`);
  } catch (err) {
    console.error(`Error using save ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
