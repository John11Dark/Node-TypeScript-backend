import { Express, Request, Response } from "express";
import users from "./users.routes";
import { createUserHandler } from "../controller/user.controller";
import validate from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";

const PATHS = Object.freeze({
  USERS: "/api/users",
  USERS_id: "/api/users/:id",
});

export default function routes(app: Express) {
  // ? This is the default route
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Server is up and running");
  });

  // ? This is the users route
  app.get(PATHS.USERS, (req: Request, res: Response) => {
    res.status(200).send("users");
  });

  app.post(PATHS.USERS, validate(createUserSchema), createUserHandler);

  app.put(PATHS.USERS_id, (req: Request, res: Response) => {
    res.status(201).send("users");
  });

  app.delete(PATHS.USERS_id, (req: Request, res: Response) => {
    res.status(201).send("users");
  });
}
