import globalMessages from "../messages/global";

export default async function info(worldState, userData, msg) {
  globalMessages.info(userData.user);
}
