import globalMessages from "../messages/global";

export default async function news(worldState, userData, msg) {
  globalMessages.news(userData.user);
}
