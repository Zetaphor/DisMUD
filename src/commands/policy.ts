import globalMessages from "../messages/global";

export default async function policy(worldState, userData, msg) {
  globalMessages.policy(userData.user);
}
