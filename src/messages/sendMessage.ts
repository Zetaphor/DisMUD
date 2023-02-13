export default function sendMessage(user, message) {
  try {
    if (typeof user === "string") {
      console.error("Sent string as userdata: " + user);
    } else if (message === "undefined" || !message.length) {
      console.error("Trying to send an empty message!");
    } else {
      user.send(message);
    }
  } catch (err) {
    console.error(`Error sending message: ${err}`);
  }
}
