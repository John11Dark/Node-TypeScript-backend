import express from "express";
import helmet from "helmet";
import cors from "cors";
import config from "config";
import compression from "compression";

// ? * -->
import { connect, logger } from "./src/utilities";
import routes from "./src/routes/routes";
import { deserializeUser } from "./src/middleware";

const port = process.env.PORT || config.get<number>("port");
const ipAddress = config.get<string>("ipAddress");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(compression());

app.use(deserializeUser);
app.listen(port, async () => {
  await connect();
  routes(app);

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === undefined
  )
    logger.info(`Server has started on  https://${ipAddress}:${port}...`);
});
