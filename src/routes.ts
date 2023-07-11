import { Express, Request, Response } from "express";
import { createUserHandler } from "./controller/user.controller";
import validate from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
export default function routes(app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post(
    "/api/users",
    validate(createUserSchema),
    createUserHandler,
    (req: Request, res: Response) => {
      res.sendStatus(200);
    }
  );
}
