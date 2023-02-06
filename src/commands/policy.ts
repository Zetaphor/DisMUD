import globalMessages from "../messages/global";

export default async function policy(simulation, userData, msg) {
  globalMessages.policy(userData.user);
}
