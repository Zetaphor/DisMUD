export const mobConstants = {
  ACTION_BITVECTOR: {
    SPEC: "a", // This flag must be set on mobiles which have special procedures written in C.
    SENTINEL: "b", // Mobiles wander around randomly by default; this bit should be set for mobiles which are to remain stationary.
    SCAVENGER: "c", // The mob should pick up valuables it finds on the ground.  More expensive items will be taken first.
    ISNPC: "d", // Reserved for internal use.  Do not set.
    AWARE: "e", // Set for mobs which cannot be backstabbed.  Replaces the ACT_NICE_THIEF bit from Diku Gamma.
    AGGRESSIVE: "f", // Mob will hit all players in the room it can see.  See also the WIMPY bit.
    STAY_ZONE: "g", // Mob will not wander out of its own zone -- good for keeping your mobs as only part of your own area.
    WIMPY: "h", // Mob will flee when being attacked if it has less than 20% of its hit points.  If the WIMPY bit is set in conjunction with any of the forms of the AGGRESSIVE bit, the mob will only attack mobs that are unconscious (sleeping or incapacitated).
    AGGR_EVIL: "i", // Mob will attack players that are evil-aligned.
    AGGR_GOOD: "j", // Mob will attack players that are good-aligned.
    AGGR_NEUTRAL: "k", // Mob will attack players that are neutrally aligned.
    MEMORY: "l", // Mob will remember the players that initiate attacks on it, and initiate an attack on that player if it ever runs into him again.
    HELPER: "m", // The mob will attack any player it sees in the room that is fighting with a mobile in the room.  Useful for groups of mobiles that travel together; i.e. three snakes in a pit, to force players to fight all three simultaneously instead of picking off one at a time.
    NOCHARM: "n", // Mob cannot be charmed.
    NOSUMMON: "o", // Mob cannot be summoned.
    NOSLEEP: "p", // Sleep spell cannot be cast on mob.
    NOBASH: "q", // Large mobs such as trees that cannot be bashed.
    NOBLIND: "r", // Mob cannot be blinded.
  },

  AFFECTION_BITVECTOR: {
    BLIND: "a", // Mob is blind.
    INVISIBLE: "b", // Mob is invisible.
    DETECT_ALIGN: "c", // Mob is sensitive to the alignment of others.
    DETECT_INVIS: "d", // Mob can see invisible characters and items.
    DETECT_MAGIC: "e", // Mob is sensitive to magical presence.
    SENSE_LIFE: "f", // Mob can sense hidden life.
    WATERWALK: "g", // Mob can traverse unswimmable water sectors.
    SANCTUARY: "h", // Mob is protected by sanctuary (half damage).
    GROUP: "i", // Reserved for internal use.  Do not set.
    CURSE: "j", // Mob is cursed.
    INFRAVISION: "k", // Mob can see in dark.
    POISON: "l", // Reserved for internal use.  Do not set.
    PROTECT_EVIL: "m", // Mob is protected from evil characters.
    PROTECT_GOOD: "n", // Mob is protected from good characters.
    SLEEP: "o", // Reserved for internal use.  Do not set.
    NOTRACK: "p", // Mob cannot be tracked.
    UNUSED16: "q", // Unused (room for future expansion).
    UNUSED17: "r", // Unused (room for future expansion).
    SNEAK: "s", // Mob can move quietly (room not informed).
    HIDE: "t", // Mob is hidden (only visible with sense life).
    UNUSED20: "u", // Unused (room for future expansion).
    CHARM: "v", // Reserved for internal use.  Do not set.
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
  },  ;

export default mobConstants;
