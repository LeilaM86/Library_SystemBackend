import { PrismaClient } from "@prisma/client";
import express from "express";
import { validate } from "../schema/Category";
import auth from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany();
  return res.send(categories);
});

router.get("/:id", async (req, res) => {
  const category = await prisma.category.findFirst({
    where: { id: req.params.id },
  });

  if (!category)
    return res.status(404).send("The category with the given id was not found");

  return res.send(category);
});

router.post("/", auth, async (req, res) => {
  console.log("getting new categories", req.body);
  const validation = validate(req.body);

  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { name: req.body.name },
    });

    if (existingCategory) {
      return res.status(400).send("Category with this name already exists.");
    }

    const newCategory = await prisma.category.create({
      data: {
        name: req.body.name,
      },
    });

    return res.status(201).send(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    return res
      .status(500)
      .send("An error occurred while creating the category.");
  }
});

router.put("/:id", auth, async (req, res) => {
  const category = await prisma.category.findFirst({
    where: { id: req.params.id },
  });

  if (!category)
    return res.status(404).send("The category with the given id was not found");

  const validation = validate(req.body);

  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const updatedCategory = await prisma.category.update({
    where: { id: req.params.id },
    data: {
      name: req.body.name,
    },
  });

  return res.send(updatedCategory);
});

router.delete("/:id", auth, async (req, res) => {
  const category = await prisma.category.findFirst({
    where: { id: req.params.id },
  });

  if (!category)
    return res.status(404).send("The category with the given id was not found");

  const deletedCategory = await prisma.category.delete({
    where: { id: req.params.id },
  });

  return res.send(deletedCategory);
});

export default router;
