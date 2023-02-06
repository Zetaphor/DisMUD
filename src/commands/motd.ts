import globalMessages from "../messages/global";

export default async function motd(simulation, userData, msg) {
  globalMessages.motd(userData.user);
}
