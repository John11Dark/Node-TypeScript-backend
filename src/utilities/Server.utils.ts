import express from "express";
import routes from "../routes/routes";
import { Authenticate } from "../middlewares";
import compression from "compression";
import cors from "cors"; // TODO: Add cors Middleware
import helmet from "helmet";

function init() {
  const app = express();

  app.use(express.json());
  app.use(express.static("public"));
  app.use(helmet());
  app.use(compression());
  app.use(Authenticate.deserializeUser);

  routes(app);

  return app;
}

export default { init };
