import globalMessages from "../messages/global";

export default async function motd(worldState, userData, msg) {
  globalMessages.motd(userData.user);
}
