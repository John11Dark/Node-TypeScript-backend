import config from "config";
// ? * -->
import { Server, connect, logger } from "./src/utilities";

const port = process.env.PORT || config.get<number>("port");
const ipAddress = config.get<string>("ipAddress");
const app = Server.init();
app.listen(port, async () => {
  await connect();

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === undefined
  )
    logger.info(`Server has started on  https://${ipAddress}:${port}...`);
});
