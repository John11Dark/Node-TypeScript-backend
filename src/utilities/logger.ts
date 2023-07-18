import logger from "pino";
import dayjs from "dayjs";

const log = logger({
  base: {
    pid: false,
    colorize: true,
    translateTime: "yyyy-mm-dd HH:MM:ss",
    ignore: "pid,hostname",
  },
  timestamp: () => `,"time":"${dayjs().format("YYYY-MM-DD HH:mm:ss")}"`,
});

export default log;
