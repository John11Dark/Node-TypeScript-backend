import { Request, Response } from "express";
import { logger } from "../utilities";
import UserService from "../service/user.service";
const User = new UserService();
export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await User.createUser(req.body);
  } catch (error) {
    logger.error(error);
    return res.status(409).send(error);
  }
}
