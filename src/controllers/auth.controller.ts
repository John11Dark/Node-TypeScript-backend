import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { Token } from "../utilities";
import { UserService, SessionService } from "../services/index";
import { CreateUserSchemaType } from "../schemas/user.schema";

async function authenticateUserHandler(
  req: Request<{}, {}, CreateUserSchemaType["body"]>,
  res: Response
) {
  try {
    const user = await UserService.find({ email: req.body.email });
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
    const { accessToken, refreshToken } = await tokenizeUserHandler(user, req);
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
    const user = await UserService.create(req.body);
    const { accessToken, refreshToken } = await tokenizeUserHandler(user, req);
    return res.status(200).send({ accessToken, refreshToken });
  } catch (error: any) {
    return res
      .status(error.statusCode)
      .send({ message: error.message, type: error.type });
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

async function tokenizeUserHandler(user: any, req: Request) {
  const session = await SessionService.create(
    user._id,
    req.headers["user-agent"] || ""
  );
  const accessToken = await Token.generateToken(user, session._id);
  const refreshToken = await Token.generateRefreshToken(user, session._id);
  return { accessToken, refreshToken };
}
export default {
  tokenizeUserHandler,
  authenticateUserHandler,
  registerUserHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
};
