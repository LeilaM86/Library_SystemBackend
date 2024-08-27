import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validate } from "../schema/Auth";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  const validation = validate(req.body);

  if (!validation.success)
    return res.status(401).send(validation.error.issues[0].message);

  const user = await prisma.user.findFirst({
    where: { username: req.body.username },
  });

  if (!user) return res.status(401).send("Invalid username or passrord");

  const isValid = bcrypt.compareSync(req.body.password, user.password);

  if (!isValid) return res.status(401).send("Invalid username or passrord");

  const { password, ...userWithoutPassword } = user;

  const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET!);

  return res.send(token);
});

export default router;

// / import express from "express";
// import bcrypt from "bcrypt";
// import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";
// import { validate } from "../schema/Auth";

// const prisma = new PrismaClient();
// const router = express.Router();

// router.post("/", async (req, res) => {
//   const validation = validate(req.body);

//   if (!validation.success)
//     return res.status(400).send(validation.error.issues[0].message);

//   const user = await prisma.user.findFirst({
//     where: { username: req.body.username },
//   });

//   if (!user) return res.status(400).send("Invalid username or passrord");

//   const isValid = bcrypt.compareSync(req.body.password, user.password);

//   if (!isValid) return res.status(400).send("Invalid username or passrord");

//   const { password, ...userWithoutPassword } = user;

//   const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET!);

//   return res.send(token);
// });

// export default router;
