export const globalMessages = {
  info(user) {
    user.send(`Info for beginners!`);
  },
  policy(user) {
    user.send(`World rules and policy`);
  },
  news(user) {
    user.send(`World news!`);
  },
  motd(user) {
    user.send(`World motd!`);
  },
};

export default globalMessages;
