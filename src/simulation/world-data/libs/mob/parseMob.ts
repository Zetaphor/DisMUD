// Converts an array of mob mobs to JSON.
export default function parseMob(mobText) {
  const lines = mobText.split("\n");

  let newMob = {};
  // console.log(lines[0]);
  newMob["id"] = parseInt(lines[0].slice(1));
  newMob["aliases"] = lines[1].slice(0, -1).toLowerCase().split(" ");
  newMob["shortDesc"] = lines[2].slice(0, -1);
  newMob["longDesc"] = lines[3];
  newMob["detailedDesc"] = lines[5];

  // console.log(lines[5]);

  let endDescIndex = 5;

  for (let i = 5; i < lines.length; i++) {
    if (lines[i] !== "~") {
      newMob["detailedDesc"] += ` ${lines[i]}`;
    } else {
      endDescIndex = i;
      i = lines.length;
    }
  }

  const vectorsFlags = lines[endDescIndex + 1].split(" ");

  newMob["actionBitVector"] = vectorsFlags[0];
  newMob["affectionBitvector"] = vectorsFlags[1];
  newMob["alignment"] = vectorsFlags[2];
  newMob["type"] = vectorsFlags[3];

  const levelArmorHP = lines[endDescIndex + 2].split(" ");
  newMob["level"] = levelArmorHP[0];
  newMob["thac0"] = levelArmorHP[1];
  newMob["armorClass"] = levelArmorHP[2];
  newMob["maxHP"] = levelArmorHP[3];
  newMob["bareHandDamage"] = levelArmorHP[4];

  const goldXP = lines[endDescIndex + 3].split(" ");
  newMob["gold"] = goldXP[0];
  newMob["xp"] = goldXP[1];

  const positionGender = lines[endDescIndex + 4].split(" ");
  newMob["loadPosition"] = positionGender[0];
  newMob["defaultPosition"] = positionGender[1];
  newMob["gender"] = positionGender[2];

  if (newMob["type"] === "E") {
    newMob["extraSpec"] = {};
    for (let i = endDescIndex + 5; i < lines.length - 1; i++) {
      if (lines[i] === "" || lines[i] === "$") continue;
      const extraSpec = lines[i].split(":");
      newMob["extraSpec"]["name"] = extraSpec[0];
      newMob["extraSpec"]["value"] = extraSpec[1];
    }
  }

  // console.log(newMob);
  return newMob;
}
