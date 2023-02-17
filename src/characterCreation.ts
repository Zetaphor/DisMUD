import characterCreationMessages from "./messages/characterCreation";
import systemMessages from "./messages/system";

export const characterCreation = {
  creationQueue: {},

  inCreationQueue: function (discordId) {
    if (typeof this.creationQueue[discordId] !== "undefined") return true;
    return false;
  },

  waitingForReaction: function (discordId) {
    if (typeof this.creationQueue[discordId] !== "undefined" && this.creationQueue[discordId].step === 1) return true;
    return false;
  },

  enterCreationQueue: async function (user) {
    console.log("Enter creation queue");
    this.creationQueue[`k${user.id}`] = {
      step: 0,
      user: user,
      className: null,
      displayName: null,
    };
    characterCreationMessages.startCreation(user);
    characterCreationMessages.chooseDisplayName(user);
  },

  creationQueueStep: async function (worldState, discordId, message) {
    const queueData = this.creationQueue[discordId];
    message = message.trim();

    if (queueData.step === 0) {
      // Select display name
      if (worldState.utils.containsBannedWord(message)) {
        characterCreationMessages.invalidDisplayName(queueData.user);
      } else if (
        await worldState.players.displayNameExists(worldState.db["players"], worldState.utils.stripString(message))
      ) {
        characterCreationMessages.takenDisplayName(queueData.user);
      } else {
        let displayName = worldState.utils.stripString(message);
        displayName = worldState.utils.capitalizeFirst(displayName);
        queueData.displayName = displayName;
        queueData.step = 1;
        characterCreationMessages.chosenDisplayName(queueData.user, queueData.displayName);
      }
    } else if (queueData.step === 1) {
      // Confirm display name
      message = message.toLowerCase();
      if (message === "y") {
        queueData.step = 2;
        characterCreationMessages.chooseClass(queueData.user);
      } else if (message === "n") {
        queueData.step = 0;
        characterCreationMessages.chooseDisplayName(queueData.user);
      } else {
        characterCreationMessages.chooseDisplayName(queueData.user);
      }
    } else if (queueData.step === 2) {
      // Select class
      message = message.toLowerCase();
      const classes = ["warrior", "thief", "cleric", "sorcerer"];
      const classChars = ["w", "t", "c", "s"];
      const classIndex = classes.indexOf(message);
      const classCharIndex = classChars.indexOf(message);
      if (classIndex !== -1 || classCharIndex !== -1) {
        queueData.step = 3;
        if (classIndex !== -1) queueData.className = classes[classIndex];
        else queueData.className = classes[classCharIndex];
        characterCreationMessages.confirmClass(queueData.user, worldState.utils.capitalizeFirst(queueData.className));
      } else {
        characterCreationMessages.invalidClass(queueData.user);
        characterCreationMessages.chooseClass(queueData.user);
      }
    } else if (queueData.step === 3) {
      // Confirm class
      message = message.toLowerCase();
      if (message === "y") {
        queueData.step = 4;
        this.exitCreationQueue(worldState, queueData);
      } else if (message === "n") {
        queueData.step = 2;
        queueData.className = null;
        characterCreationMessages.chooseClass(queueData.user);
      } else {
        characterCreationMessages.invalidClass(queueData.user);
        characterCreationMessages.confirmClass(queueData.user, queueData.className);
      }
    }
  },

  exitCreationQueue: async function (worldState, queueData) {
    try {
      await worldState.players.createNewPlayer(worldState, queueData.user, queueData.className, queueData.displayName);
      const playerData = await worldState.players.login(worldState, queueData.user, true);
      characterCreationMessages.newPlayer(queueData.user);
      worldState.players.startPlayer(worldState, playerData);
      delete this.creationQueue[`k${queueData.user.id}`];
    } catch (err) {
      console.error(`Failed to login ${queueData.user.username}`, err);
      systemMessages.loginFailed(queueData.user);
      worldState.players.logout();
      // worldState.simulation.removeWorldEntity(); // This is going to fail, there's no entity ID
    }
  },
};

export default characterCreation;
