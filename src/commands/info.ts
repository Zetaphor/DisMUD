import globalMessages from "../messages/global";

export default async function info(simulation, userData, msg) {
  globalMessages.info(userData.user);
}
