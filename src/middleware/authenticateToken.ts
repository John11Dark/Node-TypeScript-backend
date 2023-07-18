import Jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "config";
import { IUser } from "../interfaces/user.interface";
export default function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).send("Unauthorized");
  const SECRET = process.env.JWT_SECRET || config.get<string>("JWT_SECRET");
  Jwt.verify(token, SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);

    req.body.user = user;
    next();
  });
}
