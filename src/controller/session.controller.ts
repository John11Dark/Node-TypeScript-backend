import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Token } from "../utilities";
import { UserService, SessionService } from "../service/index";
import { CreateUserSchemaType } from "../schema/user.schema";

export async function createUserHandler(
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
    const accessToken = await jwt.sign(
      { session },
      process.env.JWT_SECRET || ""
    );
    const refreshToken = await Token.generateRefreshToken(user);
    return res.status(200).send({ accessToken, refreshToken });
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await SessionService.find(userId);

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await SessionService.update({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
