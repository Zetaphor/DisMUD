import logger from "../util/logger";
import { SessionUser } from "../types";

export default function sendMessage(user: SessionUser, message: string) {
  try {
    if (!user || typeof user.send !== "function") {
      logger.error("Cannot send message, invalid session user");
    } else if (message === "undefined" || !message.length) {
      logger.error("Trying to send an empty message!");
    } else {
      user.send(message);
    }
  } catch (err) {
    logger.error({ err }, "Error sending message");
  }
}
