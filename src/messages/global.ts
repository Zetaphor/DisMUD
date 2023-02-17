import emoji from "./emoji";

export const globalMessages = {
  info(user) {
    user.send(`Info for beginners!`);
  },
  policy(user) {
    user.send(
      `${emoji.scrollText} **__DisMUD Rules__** ${emoji.swordShield}\n**1)** No harassment or bullying of other players will be tolerated.\n**2)** Do not use any language or behavior that is offensive or discriminatory towards other players.\n**3)** Cheating, hacking, or exploiting game mechanics is not allowed and will result in a ban.\n**4)** Do not impersonate or pretend to be someone else.\n**5)** Do not share personal information about yourself or other players.\n**6)** Respect the privacy and property of other players.\n**7)** Do not spam or flood chat channels.\n**8)** Follow the instructions of game moderators and administrators.\n**9)** Do not engage in any activity that is illegal or unethical.\n**10)** Players are responsible for their own actions and behavior in the game.`
    );
  },
  news(user) {
    user.send(`World news!`);
  },
  motd(user) {
    user.send(`“In the beginning there was nothing, which exploded.” ― Terry Pratchett`);
  },
};

export default globalMessages;
