export const globalConstants = {
  // Booleans
  FALSE: 0,
  TRUE: 1,

  NEW_USER_ROOMNUM: 18600,
  DONATION_ROOMNUM: 3063,

  WEEKDAYS: {
    0: "the Day of the Moon",
    1: "the Day of the Bull",
    2: "the Day of the Deception",
    3: "the Day of Thunder",
    4: "the Day of Freedom",
    5: "the Day of the Great Gods",
    6: "the Day of the Sun",
  },

  MONTHS: {
    0: "Month of Winter",
    1: "Month of the Winter Wolf",
    2: "Month of the Frost Giant",
    3: "Month of the Old Forces",
    4: "Month of the Grand Struggle",
    5: "Month of the Spring",
    6: "Month of Nature",
    7: "Month of Futility",
    8: "Month of the Dragon",
    9: "Month of the Sun",
    10: "Month of the Heat",
    11: "Month of the Battle",
    12: "Month of the Dark Shades",
    13: "Month of the Shadows",
    14: "Month of the Long Shadows",
    15: "Month of the Ancient Darkness",
    16: "Month of the Great Evil",
  },

  POSITIONS: {
    POSITION_DEAD: 0,
    POSITION_MORTALLYW: 1,
    POSITION_INCAP: 2,
    POSITION_STUNNED: 3,
    POSITION_SLEEPING: 4,
    POSITION_RESTING: 5,
    POSITION_SITTING: 6,
    POSITION_FIGHTING: 7,
    POSITION_STANDING: 8,
  },

  ALIGNMENT: {
    EVIL: 0, // Mob is evil-aligned.
    NEUTRAL: 1, // Mob is neutral-aligned.
    GOOD: 2, // Mob is good-aligned.
  },

  calculateAlignment(alignment) {
    if (alignment <= -350) return this.ALIGNMENT.EVIL;
    else if (alignment <= 349) return this.ALIGNMENT.NEUTRAL;
    else return this.ALIGNMENT.GOOD;
  },

  calculateAlignmentString(alignment) {
    if (alignment <= -350) return "Evil";
    else if (alignment <= 349) return "Neutral";
    else return "Good";
  },
};

export default globalConstants;
