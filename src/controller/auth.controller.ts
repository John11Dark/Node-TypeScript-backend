import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { Token } from "../utilities";
import { UserService, SessionService } from "../service/index";
import { CreateUserSchemaType } from "../schema/user.schema";

async function authenticateUserHandler(
  req: Request<{}, {}, CreateUserSchemaType["body"]>,
  res: Response
) {
  try {
    const user = await UserService.getUserByEmail(req.body.email);
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).send("Invalid email or password");
    }
    const session = await SessionService.create(
      user._id,
      req.headers["user-agent"] || ""
    );
    const accessToken = await Token.generateToken(user, session._id);
    const refreshToken = await Token.generateRefreshToken(user, session._id);
    return res.status(200).send({ accessToken, refreshToken });
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function registerUserHandler(
  req: Request<{}, {}, CreateUserSchemaType["body"]>,
  res: Response
) {
  try {
    const user = await UserService.createUser(req.body);
    return res.status(200).send(user);
  } catch (error: any) {
    return res.status(409).send({ error: error.message });
  }
}

async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await SessionService.find(userId);

  return res.send(sessions);
}

async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await SessionService.update({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}

export default {
  authenticateUserHandler,
  registerUserHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
};
