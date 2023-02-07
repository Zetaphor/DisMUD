export const objectConstants = {
  OBJ_TYPES: {
    LIGHT: 1, // Item is a light source.
    SCROLL: 2, // Item is a magical scroll.
    WAND: 3, // Item is a magical wand.
    STAFF: 4, // Item is a magical staff.
    WEAPON: 5, // Item is a weapon.
    FIREWEAPON: 6, // Currently not implemented.  Do not use.
    MISSILE: 7, // Currently not implemented.  Do not use.
    TREASURE: 8, // Item is treasure other than gold coins (e.g. gems)
    ARMOR: 9, // Item is armor.
    POTION: 10, // Item is a magical potion.
    WORN: 11, // Currently not implemented.  Do not use.
    OTHER: 12, // Miscellaneous object with no special properties.
    TRASH: 13, // Trash -- junked by cleaners, not bought by shopkeepers.
    TRAP: 14, // Currently not implemented.  Do not use.
    CONTAINER: 15, // Item is a container.
    NOTE: 16, // Item is a note (can be written on).
    DRINKCON: 17, // Item is a drink container.
    KEY: 18, // Item is a key.
    FOOD: 19, // Item is food.
    MONEY: 20, // Item is money (gold coins).
    PEN: 21, // Item is a pen.
    BOAT: 22, // Item is a boat; allows you to traverse SECT_WATER_NOSWIM.
    FOUNTAIN: 23, // Item is a fountain.
  },

  OBJ_EFFECTS: {
    GLOW: "a", // Item is glowing (cosmetic).
    HUM: "b", // Item is humming (cosmetic).
    NORENT: "c", // Item cannot be rented.
    NODONATE: "d", // Item cannot be donated.
    NOINVIS: "e", // Item cannot be made invisible.
    INVISIBLE: "f", // Item is invisible.
    MAGIC: "g", // Item has a magical aura and can't be enchanted.
    NODROP: "h", // Item is cursed and cannot be dropped.
    BLESS: "i", // Item is blessed (cosmetic).
    ANTI_GOOD: "j", // Item can't be used by good-aligned characters.
    ANTI_EVIL: "k", // Item can't be used by evil-aligned characters.
    ANTI_NEUTRAL: "l", // Item can't be used by neutral align characters.
    ANTI_MAGIC_USER: "m", // Item can't be used by the Mage class.
    ANTI_CLERIC: "n", // Item can't be used by the Cleric class.
    ANTI_THIEF: "o", // Item can't be used by the Thief class.
    ANTI_WARRIOR: "p", // Item can't be used by the Warrior class.
    NOSELL: "q", // Shopkeepers will not buy or sell the item.
  },

  OBJ_WEAR_SLOTS: {
    WEAR_TAKE: "a", // Item can be taken (picked up off the ground).
    WEAR_FINGER: "b", // Item can be worn on the fingers.
    WEAR_NECK: "c", // Item can be worn around the neck.
    WEAR_BODY: "d", // Item can be worn on the body.
    WEAR_HEAD: "e", // Item can be worn on the head.
    WEAR_LEGS: "f", // Item can be worn on the legs.
    WEAR_FEET: "g", // Item can be worn on the feet.
    WEAR_HANDS: "h", // Item can be worn on the hands.
    WEAR_ARMS: "i", // Item can be worn on the arms.
    WEAR_SHIELD: "j", // Item can be used as a shield.
    WEAR_ABOUT: "k", // Item can be worn about the body.
    WEAR_WAIST: "l", // Item can be worn around the waist.
    WEAR_WRIST: "m", // Item can be worn around the wrist.
    WEAR_WIELD: "n", // Item can be wielded; e.g. weapons.
    WEAR_HOLD: "o", // Item can be held (the ``hold'' command).
  },

  WEAPON_DAMAGE_TYPES: {
    0: "hit/hits",
    1: "sting/stings",
    2: "whip/whips",
    3: "slash/slashes",
    4: "bite/bites",
    5: "bludgeon/bludgeons",
    6: "crush/crushes",
    7: "pound/pounds",
    8: "claw/claws",
    9: "maul/mauls",
    10: "thrash/thrashes",
    11: "pierce/pierces",
    12: "blast/blasts",
    13: "punch/punches",
    14: "stab/stabs",
  },

  OBJ_AFFECTS: {
    NONE: 0, // No effect (typically not used).
    STR: 1, // Apply to strength.
    DEX: 2, // Apply to dexterity.
    INT: 3, // Apply to intelligence.
    WIS: 4, // Apply to wisdom.
    CON: 5, // Apply to constitution.
    CHA: 6, // Apply to charisma.
    CLASS: 7, // Unimplemented.  Do not use.
    LEVEL: 8, // Unimplemented.  Do not use.
    AGE: 9, // Apply to character's MUD age, in MUD-years.
    CHAR_WEIGHT: 10, // Apply to weight.
    CHAR_HEIGHT: 11, // Apply to height.
    MANA: 12, // Apply to MAX mana points.
    HIT: 13, // Apply to MAX hit points.
    MOVE: 14, // Apply to MAX movement points.
    GOLD: 15, // Unimplemented.  Do not use.
    EXP: 16, // Unimplemented.  Do not use.
    AC: 17, // Apply to armor class (AC).
    HITROLL: 18, // Apply to hitroll.
    DAMROLL: 19, // Apply to damage roll bonus.
    SAVING_PARA: 20, // Apply to save throw: paralyze
    SAVING_ROD: 21, // Apply to save throw: rods
    SAVING_PETRI: 22, // Apply to save throw: petrif
    SAVING_BREATH: 23, // Apply to save throw: breath
    SAVING_SPELL: 24, // Apply to save throw: spells
  },
};

export default objectConstants;
