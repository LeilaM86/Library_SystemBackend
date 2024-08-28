import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user: Omit<User, "password">;
}

export default function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-auth-token"] as string;
  if (!token) return res.status(401).send("No token provided.");

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as Omit<
      User,
      "password"
    >;
    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    return res.status(400).send("Invalid token.");
  }
}
