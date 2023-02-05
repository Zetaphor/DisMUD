export default function move(simulation, userData, msg) {
  const dir = msg.length === 1 ? msg[0] : msg[1];
  let moveDir = "";

  if (dir === "n" || dir === "north") {
    moveDir = "north";
  } else if (dir === "s" || dir === "south") {
    moveDir = "south";
  } else if (dir === "e" || dir === "east") {
    moveDir = "east";
  } else if (dir === "w" || dir === "west") {
    moveDir = "west";
  } else if (dir === "u" || dir === "up") {
    moveDir = "up";
  } else if (dir === "d" || dir === "down") {
    moveDir = "down";
  } else {
    userData.user.send(`❓ Unknown direction: **${dir}**`);
    return;
  }

  console.log(`move: ${userData.user.username}, ${moveDir}`);
}
