import { NextFunction, Request, Response } from "express";
import { Token } from "../utilities";
export default function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).send("Unauthorized");
  const decoded = Token.verifyToken(token);
  if (decoded == null) return res.status(403).send("Forbidden");
  req.body.user = decoded;
  next();
}
