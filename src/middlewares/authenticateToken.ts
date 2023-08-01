import { NextFunction, Request, Response } from "express";
import { Token } from "../utilities";
import config from "config";
import { get } from "lodash";

import { SessionService } from "../services";
async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const CUSTOM_KEY = config.get<string>("HEADER_KEY");
  const authHeader = req.headers["authorization"];
  const customAuthHeader = req.headers[CUSTOM_KEY] as string;
  const token = authHeader?.split(" ")[1];
  const customToken = customAuthHeader?.split(" ")[1];

  if (token == null || customToken == null) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const { decoded: decodedCustomToken } = await Token.verifyToken(
      customToken
    );
    if (decodedCustomToken == null) {
      return res.status(403).send("Forbidden");
    }

    const { decoded } = await Token.verifyToken(token);
    if (decoded == null) {
      return res.status(403).send("Forbidden");
    }

    res.locals.user = decoded;
    next();
  } catch (err: any) {
    throw {
      message: err.message,
      info: "unable to verify token",
      statusCode: 500,
    };
  }
}

async function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user } = res.locals;
  if (user?.role === "admin") return next();

  return res.status(403).send({
    message: "Forbidden",
    info: "You are not authorized to access this resource",
  });
}

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

const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;

  if (!user) return res.status(401).send("Unauthorized");

  return next();
};

export default {
  authenticateToken,
  authenticateAdmin,
  deserializeUser,
};
