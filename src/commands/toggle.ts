import emoji from "../messages/emoji";

export default function toggle(worldState, userData, msg) {
  try {
    if (msg[0] === "toggle") {
      userData.sendMessage(
        userData.user,
        `${emoji.settings} _Toggle which option?_\n\n${emoji.echo} ${
          userData.userPrefs.localRepeat ? "**Enabled**" : "_Disabled_"
        } - echo _(Chat repeating)_\n${emoji.whisper} ${
          userData.userPrefs.hearTell ? "**Enabled**" : "_Disabled_"
        } - tell _(Hear tells)_\n${emoji.shout} ${
          userData.userPrefs.hearShout ? "**Enabled**" : "_Disabled_"
        } - shout _(Hear shouts)_\n${emoji.globalChat} ${
          userData.userPrefs.chanGlobal ? "**Enabled**" : "_Disabled_"
        } - global _(Global chat)_\n${emoji.auctionChat} ${
          userData.userPrefs.chanAuction ? "**Enabled**" : "_Disabled_"
        } - auction _(Auction chat)_\n${emoji.brief} ${
          userData.userPrefs.roomBrief ? "**Enabled**" : "_Disabled_"
        } - brief _(Brief areas)_\n${emoji.directions} ${
          userData.userPrefs.autoExits ? "**Enabled**" : "_Disabled_"
        } - exits _(Show exits)_\n${emoji.follow} ${
          userData.userPrefs.follow ? "**Enabled**" : "_Disabled_"
        } - follow _(Enable followers)_\n${emoji.discord} ${
          userData.userPrefs.discordId ? "**Enabled**" : "_Disabled_"
        } - discord _(Show Discord User)_\n\n_Use \`help toggle\` to learn more._`
      );
    } else {
      if (msg[0] === "echo") {
        userData.userPrefs.localRepeat = !userData.userPrefs.localRepeat;
        userData.sendMessage(
          userData.user,
          `${emoji.echo} _Chat repeating ${userData.userPrefs.localRepeat ? "enabled" : "disabled"}_.`
        );
      } else if (msg[0] === "tell") {
        userData.userPrefs.hearTell = !userData.userPrefs.hearTell;
        userData.sendMessage(
          userData.user,
          `${emoji.whisper} ${
            userData.userPrefs.hearTell
              ? `_You will now receive_ \`tell\` _messages._`
              : `_You will no longer receive_ \`tell\` _messages._`
          }`
        );
      } else if (msg[0] === "shout") {
        userData.userPrefs.hearShout = !userData.userPrefs.hearShout;
        userData.sendMessage(
          userData.user,
          `${emoji.shout} ${
            userData.userPrefs.hearShout ? `_You will now hear shouts._` : `_You will no longer hear shouts._`
          }`
        );
      } else if (msg[0] === "global") {
        userData.userPrefs.chanGlobal = !userData.userPrefs.chanGlobal;
        userData.sendMessage(
          userData.user,
          `${emoji.globalChat} ${
            userData.userPrefs.chanGlobal
              ? `_You will now hear global messages._`
              : `_You will no longer hear global messages._`
          }`
        );
      } else if (msg[0] === "auction") {
        userData.userPrefs.chanAuction = !userData.userPrefs.chanAuction;
        userData.sendMessage(
          userData.user,
          `${emoji.auctionChat} ${
            userData.userPrefs.chanAuction
              ? `_You will now hear auction messages._`
              : `_You will no longer hear auction messages._`
          }`
        );
      } else if (msg[0] === "brief") {
        userData.userPrefs.roomBrief = !userData.userPrefs.roomBrief;
        userData.sendMessage(
          userData.user,
          `${emoji.brief} ${
            userData.userPrefs.roomBrief
              ? `_You will no longer see area descriptions._`
              : `_You will now see area descriptions._`
          }`
        );
      } else if (msg[0] === "exits") {
        userData.userPrefs.autoExits = !userData.userPrefs.autoExits;
        userData.sendMessage(
          userData.user,
          `${emoji.directions} ${
            userData.userPrefs.autoExits
              ? `_You will now automatically see room exits._`
              : `_You will no longer automatically see room exits._`
          }`
        );
      } else if (msg[0] === "follow") {
        userData.userPrefs.follow = !userData.userPrefs.follow;
        userData.sendMessage(
          userData.user,
          `${emoji.follow} ${
            userData.userPrefs.follow ? `_You can now be followed._` : `_You can no longer be followed._`
          }`
        );
      } else if (msg[0] === "discord") {
        userData.userPrefs.discordId = !userData.userPrefs.discordId;
        userData.sendMessage(
          userData.user,
          `${emoji.discord} ${
            userData.userPrefs.discordId
              ? `_Your Discord ID is now visible to other users._`
              : `_You Discord ID is no longer visible to other users._`
          }`
        );
      } else {
        userData.sendMessage(
          userData.user,
          `${emoji.question} _Invalid toggle option. Valid options are: echo, tell, shout, global, auction, brief, exits._`
        );
      }
    }

    // const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    // worldState.broadcasts.sendToRoom(
    //   worldState,
    //   roomNum,
    //   userData.eid,
    //   false,
    //   `${emoji.info} _${userData.displayName} ${msg.join(" ")}_`
    // );
  } catch (err) {
    console.error(`Error using toggle ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
