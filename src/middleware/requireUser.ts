import { Request, Response, NextFunction } from "express";

export default function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = res.locals.user;

  if (!user) return res.status(401).send("Unauthorized");

  return next();
}
