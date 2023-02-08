### Exp system

Here's a simple experience level system that ranges from level 1 to 1000:

    Experience Points (XP) are earned by completing quests, defeating enemies, and engaging in other activities within the game.

    Each time a player earns enough XP, they will level up. The amount of XP needed to reach the next level is determined by the following formula:
    XP_to_next_level = 100 * (current_level ^ 2)

    As players level up, their stats will increase. You can determine the stat increase by using a formula or by manually adjusting their stats for each level.

    At level 1000, players will have reached the maximum level and will no longer be able to level up. However, they can continue to earn XP and engage in other activities within the game.

    You can also add additional bonuses for reaching specific milestones, such as level 50 or level 100, to give players a sense of progress and achievement.

Here's a simple example of how the XP needed to reach the next level changes as a player levels up:

Level 1: 100 XP
Level 2: 300 XP
Level 3: 600 XP
Level 4: 1000 XP
Level 5: 1500 XP
Level 6: 2100 XP
and so on...

Warrior
Starting stats:
str: 18
dex: 14
con: 16
int: 10
wis: 12
cha: 8
ac: 15
mana: 100

Stat increases per level:
str: +2
dex: +1
con: +2
int: +0
wis: +1
cha: +0
ac: +1
mana: +10

Mage
Starting stats:
str: 10
dex: 12
con: 14
int: 16
wis: 8
cha: 18
ac: 10
mana: 150

Stat Increases per level:
str: +0
dex: +1
con: +1
int: +2
wis: +0
cha: +2
ac: +0
mana: +20

Rogue
Starting stats:
str: 14
dex: 18
con: 12
int: 8
wis: 10
cha: 16
ac: 20
mana: 50

Stat Increases per level:
str: +1
dex: +2
con: +1
int: +0
wis: +0
cha: +1
ac: +2
mana: +10

Cleric
Starting stats:
str: 12
dex: 10
con: 16
int: 8
wis: 18
cha: 14
ac: 12
mana: 150

Stat Increases per level:
str: +1
dex: +0
con: +2
int: +0
wis: +2
cha: +1
ac: +1
mana: +20

Paladin
Starting stats:
str: 16
dex: 14
con: 18
int: 12
wis: 16
cha: 10
ac: 18
mana: 100

Stat Increases per level:
str: +2
dex: +1
con: +2
int: +1
wis: +1
cha: +0
ac: +1
mana: +15

### Spellcasting

When implementing a magic spell in a MUD, you can utilize the stats of a character in different ways to determine its effectiveness. Here are some ways you could use the stats:

Strength (str) - This stat could determine the physical power behind a spell, such as the force of a fireball or the knockback of a wind blast.

Dexterity (dex) - This stat could determine the accuracy and speed of spellcasting, such as the chance of evading a spell or the speed at which a spell is cast.

Constitution (con) - This stat could determine the amount of damage a character can withstand, or the duration they can sustain a spell before needing to rest.

Intelligence (int) - This stat could determine the power and complexity of a spell, such as the size of a fireball or the number of targets a spell can affect.

Wisdom (wis) - This stat could determine the character's understanding of magic, such as the effectiveness of healing spells or the ability to resist enemy spells.

Charisma (cha) - This stat could determine the character's ability to influence others with their magic, such as the effectiveness of charm spells or the ability to rally allies in battle.

Experience (exp) - This stat could determine the character's mastery of magic, such as the number of spells they can cast or the strength of spells they can cast.

Armor Class (ac) - This stat could determine the character's defense against spells, such as the chance of avoiding a spell or the amount of damage they can absorb.

Mana (mana) - This stat could determine the character's ability to cast spells, such as the number of spells they can cast before needing to rest or the strength of spells they can cast before running out of mana.
