export const roomMessages = {
  displayRoom(user, roomData) {
    user.send(`
    ☀️ **__${roomData.name}__** ${roomData.adminTag}\n
      ${roomData.desc}\n
      ${roomData.itemDescriptions}
      ${roomData.mobDescriptions}
      ${roomData.playerDescriptions}
    `);
  },
};

export default roomMessages;
