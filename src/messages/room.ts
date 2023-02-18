export const roomMessages = {
  displayRoom(user, roomData) {
    user.send(`
    ☀️ **__${roomData.name}__** ${roomData.adminTag}\n\n${roomData.desc.length ? roomData.desc + "\n\n" : ""} ${
      roomData.itemDescriptions
    }${roomData.mobDescriptions}${roomData.playerDescriptions}`);
  },
};

export default roomMessages;
