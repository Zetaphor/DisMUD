import emoji from "./emoji";

export const characterCreationMessages = {
  startCreation: function (user) {
    user.send(`
      ${emoji.sword} **__DisMUD__** ${emoji.shield}
      \n${emoji.sparkles} Welcome to DisMUD ${user.username}!\n\n You do not yet have a user account and will begin the character creation process! ${emoji.sparkles}
    `);
  },
  chooseDisplayName: function (user) {
    user.send(
      `${emoji.pen} Please enter the name you wish to be known by in this world.\n_(Profanity and non-alphanumeric characters will be removed)_`
    );
  },
  invalidDisplayName: function (user) {
    user.send(`${emoji.error} Invalid display name, please try again.`);
  },
  takenDisplayName: function (user) {
    user.send(`${emoji.error} There is already another user with that display name, please try again.`);
  },
  chosenDisplayName: function (user, displayName) {
    user.send(`${emoji.scrollText} You will now be known as ${displayName}\n Continue to class selection? **(y/n)**`);
  },
  chooseClass: function (user) {
    user.send(
      `Welcome to DisMUD, choose your class:\n${emoji.classWarrrior} **(W)**arrior\n${emoji.classCleric} **(C)**leric\n${emoji.classThief} **(T)**hief\n${emoji.classSorcerer} **(S)**orcerer`
    );
  },
  invalidClass: function (user) {
    user.send(`${emoji.error} Invalid class selection, please try again.`);
  },
  confirmClass: function (user, className) {
    user.send(
      `You have chosen the ${
        className.charAt(0).toUpperCase() + className.slice(1)
      } class.\nAre you sure you want to continue? **(y/n)**`
    );
  },
  newPlayer: function (user) {
    user.send(`
      ${emoji.sword} **__DisMUD__** ${emoji.shield}
      \n${emoji.sparkles} Welcome to DisMUD ${user.username}!\n\n You now have a user account.\n\nEnjoy the world! ${emoji.sparkles}
    `);
  },
};

export default characterCreationMessages;
