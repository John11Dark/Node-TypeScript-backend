import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { Token } from "../utilities";
import { SessionService } from "../service";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x-refresh");

  if (!accessToken) {
    return next();
  }

  const user = Token.verifyToken(accessToken);

  if (user) {
    res.locals.user = user;
    return next();
  }

  if (user && refreshToken) {
    let newAccessToken;
    if (typeof refreshToken === "string")
      newAccessToken = await SessionService.reIssueAccessToken({
        refreshToken,
      });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }

    const result = Token.verifyToken(newAccessToken as string);

    res.locals.user = result;
    return next();
  }

  return next();
};

export default deserializeUser;
