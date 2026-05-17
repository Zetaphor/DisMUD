import logger from "../util/logger";

export default function sendMessage(user, message) {
  try {
    if (typeof user === "string") {
      logger.error("Sent string as userdata: " + user);
    } else if (message === "undefined" || !message.length) {
      logger.error("Trying to send an empty message!");
    } else {
      user.send(message);
    }
  } catch (err) {
    logger.error({ err }, "Error sending message");
  }
}
