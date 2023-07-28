import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { Token } from "../utilities";
import { SessionService } from "../service";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req.headers, "authorization", "").replace(
    /^Bearer\s/,
    ""
  );
  const refreshToken = get(req.headers, "refresh-token", "")[0];

  if (!accessToken) {
    return next();
  }

  try {
    const { decoded, expired } = await Token.verifyToken(accessToken);

    if (decoded && !expired) {
      res.locals.user = decoded;
      return next();
    }

    if (expired && refreshToken) {
      const newAccessToken = await SessionService.reIssueAccessToken(
        refreshToken
      );

      if (!newAccessToken) {
        return next();
      }

      res.setHeader("Authorization", `Bearer ${newAccessToken}`);

      const { decoded } = await Token.verifyToken(newAccessToken);

      res.locals.user = decoded;
      return next();
    }

    return next();
  } catch (error) {
    console.error("Error in deserializeUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default deserializeUser;
