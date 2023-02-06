import globalMessages from "../messages/global";

export default async function news(simulation, userData, msg) {
  globalMessages.news(userData.user);
}
