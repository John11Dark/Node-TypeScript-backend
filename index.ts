import express from "express";
import helmet from "helmet";
import cors from "cors";
import config from "config";
import compression from "compression";

// ? * -->
import { connect, logger } from "./src/utilities";
import routes from "./src/routes";
import { deserializeUser } from "./src/middleware";

const port = process.env.PORT || config.get<number>("port");
const ipAddress = config.get<string>("ipAddress");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(compression());

app.use(deserializeUser);
app.listen(port, async () => {
  if (process.env.NODE_ENV === "development")
    logger.info(`Server has started on  ${ipAddress}:${port}...`);
  await connect();
  routes(app);
  console.log("Server has started on port 3000...");
});
console.log(app);
