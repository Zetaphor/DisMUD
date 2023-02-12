import emoji from "../messages/emoji";
import globalConstants from "../simulation/constants/global";

export default async function score(worldState, userData, msg) {
  try {
    const playerStats = await worldState.simulation.getPlayerStats(userData.eid);
    const scoreString = `${emoji.scrollText} **__${userData.displayName}__** _(Level ${
      playerStats.level
    })_\n\nYou are 17 years old.\nYou have ${playerStats.hp}/${playerStats.hpMax}(+${playerStats.hpMod}) hit, ${
      playerStats.mana
    }/${playerStats.manaMax}(+${playerStats.manaMod}) mana and ${playerStats.move}/${playerStats.moveMax}(+${
      playerStats.moveMod
    }) movement points.\nYour armor class is ${playerStats.ac}(+${
      playerStats.acMod
    }), and your alignment is ${globalConstants.calculateAlignmentString(playerStats.alignment)} (${
      playerStats.alignment
    }).\nYou have scored ${playerStats.exp} exp, and have ${
      userData.gold
    } gold coins.\nYou need 1499 exp to reach your next level.`;
    userData.user.send(scoreString);
  } catch (err) {
    console.error(`Error using save ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
