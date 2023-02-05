import roomMessages from "../messages/roomMessages";

export default function buildRoom(user, wldData) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const roomData = {
        name: wldData.name,
        desc: wldData.desc,
        descriptors: "",
      };
      roomMessages.displayRoom(user, roomData);

      console.log(wldData.roomBitVector);

      resolve();
    } catch (err) {
      console.error(`Error building room #${wldData.id} for user ${user.username}, : ${err}`);
      reject();
    }
  });
}
