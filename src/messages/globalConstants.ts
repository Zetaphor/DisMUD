export const globalConstants = {
  mobPlayerStates: {
    0: "is lying here, dead.",
    1: "is lying here, mortally wounded.",
    2: "is lying here, incapacitated.",
    3: "is lying here, stunned.",
    4: "is sleeping here.",
    5: "is resting here.",
    6: "is sitting here.",
    7: "is FIGHTING!",
    8: "is standing here.",
  },

  liquidTypes: {
    "0": {
      type: "water",
      drunk: 0,
      hunger: 1,
      thirst: 10,
    },
    "1": {
      type: "beer",
      drunk: 3,
      hunger: 2,
      thirst: 5,
    },
    "2": {
      type: "wine",
      drunk: 5,
      hunger: 2,
      thirst: 5,
    },
    "3": {
      type: "ale",
      drunk: 2,
      hunger: 2,
      thirst: 5,
    },
    "4": {
      type: "dark ale",
      drunk: 1,
      hunger: 2,
      thirst: 5,
    },
    "5": {
      type: "whiskey",
      drunk: 6,
      hunger: 1,
      thirst: 4,
    },
    "6": {
      type: "lemonade",
      drunk: 0,
      hunger: 1,
      thirst: 8,
    },
    "7": {
      type: "firebreather",
      drunk: 10,
      hunger: 0,
      thirst: 0,
    },
    "8": {
      type: "ambrosia",
      drunk: 3,
      hunger: 3,
      thirst: 3,
    },
    "9": {
      type: "slime",
      drunk: 0,
      hunger: 4,
      thirst: -8,
    },
    "10": {
      type: "milk",
      drunk: 0,
      hunger: 3,
      thirst: 6,
    },
    "11": {
      type: "tea",
      drunk: 0,
      hunger: 1,
      thirst: 6,
    },
    "12": {
      type: "coffee",
      drunk: 0,
      hunger: 1,
      thirst: 6,
    },
    "13": {
      type: "blood",
      drunk: 0,
      hunger: 2,
      thirst: -1,
    },
    "14": {
      type: "sea water",
      drunk: 0,
      hunger: 1,
      thirst: -2,
    },
    "15": {
      type: "clear water",
      drunk: 0,
      hunger: 0,
      thirst: 13,
    },
  },
};

export default globalConstants;
