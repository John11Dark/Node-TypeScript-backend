import { Request, Response } from "express";
import { logger } from "../utilities";
import UserService from "../service/user.service";
import { CreateUserSchemaType } from "../schema/user.schema";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserSchemaType["body"]>,
  res: Response
) {
  try {
    const token = await UserService.createUser(req.body);
    return res.status(200).send(token);
  } catch (error) {
    logger.error(error);
    return res.status(409).send(error);
  }
}
