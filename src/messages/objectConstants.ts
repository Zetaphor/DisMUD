import emoji from "./emoji";

export const objectConstants = {
  types: {
    1: `${emoji.lantern} This item can be used to illuminate dark areas.`, // Item is a light source.
    2: `${emoji.scroll} This is a magical scroll.`, // Item is a magical scroll.
    3: `${emoji.magicWand} This is a magical wand.`, // Item is a magical wand.
    4: `${emoji.magicStaff} This is a magical staff.`, // Item is a magical staff.
    5: `${emoji.sword} This is a weapon.`, // Item is a weapon.
    6: ``, // Currently not implemented.  Do not use.
    7: ``, // Currently not implemented.  Do not use.
    8: `${emoji.treasure} This item is valuable treasure.`, // Item is treasure other than gold coins (e.g. gems)
    9: `${emoji.armor} This item can be worn as armor.`, // Item is armor.
    10: `${emoji.potion} This item is a magical potion.`, // Item is a magical potion.
    11: ``, // Currently not implemented.  Do not use.
    12: `This is a miscellaneous object.`, // Miscellaneous object with no special properties.
    13: `${emoji.junk} This is item is junk.`, // Trash -- junked by cleaners, not bought by shopkeepers.
    14: ``, // Currently not implemented.  Do not use.
    15: `${emoji.chest} This item is a container that can hold other items.`, // Item is a container.
    16: `${emoji.parchment} This is a note that you can leave notes on.`, // Item is a note (can be written on).
    17: `${emoji.bottle} This is a bottle that can be filled and drank from.`, // Item is a drink container.
    18: `${emoji.key} This is a key.`, // Item is a key.
    19: `${emoji.bread} This is food that can be eaten.`, // Item is food.
    20: `${emoji.coins} This is money that can be buy things.`, // Item is money (gold coins).
    21: `${emoji.pen} This is a pen that can be used to write notes.`, // Item is a pen.
    22: `${emoji.boat} This is a boat that can be used to traverse water.`, // Item is a boat; allows you to traverse SECT_WATER_NOSWIM.
    23: `${emoji.fountain} This is a fountain that contains a liquid.`, // Item is a fountain.
  },

  effects: {
    a: `${emoji.glowing} This item is glowing brightly!`, // Item is glowing (cosmetic).
    b: `${emoji.humming} This item is emitting a humming sound!`, // Item is humming (cosmetic).
    c: `This item cannot be rented.`, // Item cannot be rented.
    d: `This item cannot be donated.`, // Item cannot be donated.
    e: `This item is not affected by invisibility.`, // Item cannot be made invisible.
    f: `${emoji.blind} This item is invisible!`, // Item is invisible.
    g: `${emoji.aura} This item is surrounded by a magical aura!`, // Item has a magical aura and can't be enchanted.
    h: `${emoji.cursed} This item has been cursed!`, // Item is cursed and cannot be dropped.
    i: `${emoji.blessed} This item has been blessed by the gods!`, // Item is blessed (cosmetic).
    j: `This item cannot be used by those who follow the path of good.`, // Item can't be used by good-aligned characters.
    k: `This item cannot be used by those who follow the path of evil.`, // Item can't be used by evil-aligned characters.
    l: `This item cannot be used by those of a neutral alignment.`, // Item can't be used by neutral align characters.
    m: ``, // Item can't be used by the Mage class.
    n: ``, // Item can't be used by the Cleric class.
    o: ``, // Item can't be used by the Thief class.
    p: ``, // Item can't be used by the Warrior class.
    q: `Shopkeepers will not buy or sell this item.`, // Shopkeepers will not buy or sell the item.
  },

  wear: {
    1: `This item can be picked up off the ground.`, // Item can be taken (picked up off the ground).
    2: `This item can be worn on the fingers.`, // Item can be worn on the fingers.
    4: `This item can be worn around the neck.`, // Item can be worn around the neck.
    8: `This item can be worn on the body.`, // Item can be worn on the body.
    16: `This item can be worn on the head.`, // Item can be worn on the head.
    32: `This item can be worn on the legs.`, // Item can be worn on the legs.
    64: `This item can be worn on the feet.`, // Item can be worn on the feet.
    128: `This item can be worn on the hands,`, // Item can be worn on the hands.
    256: `This item can be worn on the arms.`, // Item can be worn on the arms.
    512: `This item can be used as a shield.`, // Item can be used as a shield.
    1024: `This item can be worn about the body.`, // Item can be worn about the body.
    2048: `This item can be worn around the waist.`, // Item can be worn around the waist.
    4096: `This item can be worn around the wrist.`, // Item can be worn around the wrist.
    8192: `This item can be wielded.`, // Item can be wielded; e.g. weapons.
    16384: `This item can be held.`, // Item can be held (the ``hold'' command).
  },
};

export default objectConstants;
