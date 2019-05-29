import { createLogger, format, transports } from "winston";
import dailyRotateFile from "winston-daily-rotate-file";
import * as fs from "fs";
import moment from "moment-timezone";
import { NODE_ENV } from "../environment";

const logDir = "logs";

const { combine, timestamp, splat, printf } = format;

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tzTimestamp = format((info, opts) => {
  if (opts.tz) {
    info.timestamp = moment()
      .tz(opts.tz)
      .format("YYYY-MM-DD HH:mm:ss");
  }
  return info;
});

const logger = createLogger({
  format: combine(
    tzTimestamp({ tz: "Europe/Helsinki" }),
    splat(), // Enables string formating, aka. %s %d
    printf(info => {
      return `[${info.timestamp}] ${info.level}: ${info.message}`;
    })
  ),
  transports: [
    new dailyRotateFile({
      filename: `${logDir}/%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      level: NODE_ENV === "development" ? "verbose" : "info",
      maxFiles: "30d"
    })
  ]
});

logger.on("rotate", (oldFilename, newFilename) => {
  // do something fun
});

logger.log("info", "Starting logging service...");

export default logger;
