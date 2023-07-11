import { Request, Response } from "express";
import { logger } from "../utilities";
import UserService from "../service/user.service";
import { CreateUserSchemaType } from "../schema/user.schema";
const UserServices = new UserService();
export async function createUserHandler(
  req: Request<{}, {}, CreateUserSchemaType["body"]>,
  res: Response
) {
  try {
    const user = await UserServices.createUser(req.body);
  } catch (error) {
    logger.error(error);
    return res.status(409).send(error);
  }
}
