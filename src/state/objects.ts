export const objects = {
  loadObject(db, vNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const object = await db.methods.getObjectData(vNum);
        resolve(object);
      } catch (err) {
        console.error(`Error loading object ${vNum}: ${err.message}`);
        reject(err);
      }
    });
  },
};

export default objects;
