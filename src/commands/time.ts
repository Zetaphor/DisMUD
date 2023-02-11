import emoji from "../messages/emoji";
import globalConstants from "../simulation/constants/global";

export default function time(worldState, userData, msg) {
  try {
    let timeString = `It is the ${numberToWord(worldState.simulation.world.time.hour + 1)} hour of ${
      globalConstants.WEEKDAYS[worldState.simulation.world.time.weekday + 1]
    } in the ${globalConstants.MONTHS[worldState.simulation.world.time.month]} of the ${numberToWord(
      worldState.simulation.world.time.year + 1
    )} Year`;
    userData.user.send(`${emoji.scrollText} _${timeString}_`);
  } catch (err) {
    console.error(`Error using time ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}

function numberToWord(number) {
  if (number >= 11 && number <= 13) {
    return number + "th";
  } else {
    switch (number % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
      default:
        return number + "th";
    }
  }
}
