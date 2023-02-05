export const roomMessages = {
  displayRoom(user, roomData) {
    user.send(`
    ☀️ **__${roomData.name}__**\n
      ${roomData.desc}
    `);
  },
};

export default roomMessages;
