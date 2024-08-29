import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validate } from "../schema/Users";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  const validation = validate(req.body);

  if (!validation.success)
    return res.status(401).send(validation.error.issues[0].message);

  const existingUser = await prisma.user.findFirst({
    where: { username: req.body.username },
  });

  if (existingUser) return res.status(400).send("User already exist");

  const password = bcrypt.hashSync(req.body.password, 12);

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      username: req.body.username,
      password,
    },
  });

  const { password: p, ...userWithoutPassword } = user;

  const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET!);
  return res
    .header("access-control-expose-headers", "x-auth-token")
    .header("x-auth-token", token)
    .send(userWithoutPassword);
});

export default router;
