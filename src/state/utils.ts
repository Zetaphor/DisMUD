export const utils = {
  getPlayerData(worldState, discordId) {
    const onlinePlayer = Object.keys(worldState.players.currentActive).filter(
      (id) => worldState.players.currentActive[id].discordId === discordId
    );
    return onlinePlayer;
  },
};

export default utils;
