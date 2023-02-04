export const systemMessages = {
  notifyOnline: function (client) {
    client.users.fetch("134317574342180864", false).then((user) => {
      user.send("🟢 System Online");
    });
  },
};

export default systemMessages;
