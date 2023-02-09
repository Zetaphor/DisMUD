export const roomMessages = {
  displayRoom(user, roomData) {
    user.send(`
    ☀️ **__${roomData.name}__**\n
      ${roomData.desc}\n
      ${roomData.itemDescriptions}
      ${roomData.mobDescriptions}
    `);
  },
};

export default roomMessages;
