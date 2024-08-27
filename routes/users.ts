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

// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";
// import { validateUser } from "../schema/Users";

// const prisma = new PrismaClient();
// const router = express.Router();

// router.post("/", async (req, res) => {
//   console.log("Received request to create user:", req.body);

//   const validation = validateUser(req.body);

//   if (!validation.success) {
//     const errors = validation.error.issues
//       .map((issue) => issue.message)
//       .join(", ");
//     console.error("Validation failed:", errors);
//     return res.status(400).send(`Validation failed: ${errors}`);
//   }

//   const { username, password, name } = req.body;

//   const existingUser = await prisma.user.findUnique({
//     where: { username },
//   });

//   if (existingUser) {
//     return res.status(400).send("User already exists");
//   }

//   const hashedPassword = bcrypt.hashSync(password, 12);

//   try {
//     const user = await prisma.user.create({
//       data: {
//         username,
//         password: hashedPassword,
//         name,
//       },
//     });

//     const { password: p, ...userWithoutPassword } = user;
//     const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET!);

//     res
//       .header("access-control-expose-headers", "x-auth-token")
//       .header("x-auth-token", token)
//       .send(userWithoutPassword);
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).send("An error occurred while creating the user.");
//   }
// });

// export default router;
