import logger from "pino";
const log = logger({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:HH:MM",
      ignore: "pid,hostname",
    },
  },
});

export default log;
