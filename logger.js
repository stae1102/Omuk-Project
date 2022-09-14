import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";

const { createLogger, format, transports } = winston;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

const logger = createLogger({
  level: "http" ? process.env.NODE_ENV === "production" : "debug",
  levels,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  ),
  transports: [
    new transports.DailyRotateFile({
      level: "debug",
      dirname: path.join(__dirname, "/logs", "/combined"),
      filename: "combined-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: 7,
    }),
    new transports.DailyRotateFile({
      level: "error",
      dirname: path.join(__dirname, "/logs", "/error"),
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: 30,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({ format: format.simple() }));
}

export default logger;
