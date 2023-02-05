export const roomMessages = {
  displayRoom: function (user, roomData) {
    user.send(`
    ☀️ **__${roomData.name}__**\n
      ${roomData.desc}
    `);
  },
};

export default roomMessages;
