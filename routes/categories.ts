import { PrismaClient } from "@prisma/client";
import express from "express";
import { validate } from "../schema/Category";

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

router.post("/", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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

// import express from "express";

// import { PrismaClient } from "@prisma/client";
// import auth from "../middleware/auth";
// import { validate } from "../schema/Category";

// const router = express.Router();
// const prisma = new PrismaClient();

// router.get("/", async (req, res) => {
//   try {
//     const categories = await prisma.category.findMany();
//     return res.json(categories);
//   } catch (error) {
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// });

// router.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const category = await prisma.category.findUnique({
//       where: { id: parseInt(id) },
//     });
//     if (!category) {
//       return res.status(404).json({ error: "Category not found" });
//     }
//     return res.json(category);
//   } catch (error) {
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// });

// // Skapa en ny kategori
// router.post("/", auth, async (req, res) => {
//   const validation = validate(req.body); // Validering baserat på schema

//   if (!validation.success) {
//     return res.status(400).json({ error: validation.error.issues[0].message });
//   }

//   try {
//     const newCategory = await prisma.category.create({
//       data: {
//         name: req.body.name,
//       },
//     });
//     return res.status(201).json(newCategory);
//   } catch (error) {
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// });

// // Uppdatera en kategori med ett specifikt id
// router.put("/:id", auth, async (req, res) => {
//   const { id } = req.params;
//   const validation = validate(req.body); // Validering baserat på schema

//   if (!validation.success) {
//     return res.status(400).json({ error: validation.error.issues[0].message });
//   }

//   try {
//     const updatedCategory = await prisma.category.update({
//       where: { id: parseInt(id) },
//       data: {
//         name: req.body.name,
//       },
//     });
//     return res.json(updatedCategory);
//   } catch (error) {
//     if (error.code === "P2025") {
//       return res.status(404).json({ error: "Category not found" });
//     }
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// });

// // Radera en kategori med ett specifikt id
// router.delete("/:id", auth, async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedCategory = await prisma.category.delete({
//       where: { id: parseInt(id) },
//     });
//     return res.json(deletedCategory);
//   } catch (error) {
//     if (error.code === "P2025") {
//       return res.status(404).json({ error: "Category not found" });
//     }
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// });

// export default router;

// import express from "express";
// import { PrismaClient } from "@prisma/client";
// import {
//   validateCreateCategory,
//   validateUpdateCategory,
// } from "../schema/Category";
// import auth from "../middleware/auth";

// const router = express.Router();
// const prisma = new PrismaClient();

// router.get("/", async (req, res) => {
//   try {
//     console.log("Received request to fetch all categories");

//     const categories = await prisma.category.findMany();
//     console.log("Categories fetched:", categories);

//     res.send(categories);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     res.status(500).send("An error occurred while fetching categories.");
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     console.log("Received request to fetch category:", req.params.id);

//     const category = await prisma.category.findUnique({
//       where: { id: req.params.id },
//     });

//     if (!category) {
//       return res
//         .status(404)
//         .send("The category with the given id was not found.");
//     }

//     console.log("Category fetched:", category);
//     res.send(category);
//   } catch (error) {
//     console.error("Error fetching category:", error);
//     res.status(500).send("An error occurred while fetching the category.");
//   }
// });

// router.post("/", auth, async (req, res) => {
//   try {
//     console.log("Received request to create a category:", req.body);

//     const validation = validateCreateCategory(req.body);
//     if (!validation.success) {
//       console.log("Validation failed:", validation.error.errors);
//       return res
//         .status(400)
//         .send(validation.error.errors.map((err) => err.message).join(", "));
//     }

//     const { name } = req.body;
//     const category = await prisma.category.create({
//       data: { name },
//     });

//     console.log("Category created:", category);
//     res.status(201).send(category);
//   } catch (error) {
//     console.error("Error creating category:", error);
//     res.status(500).send("An error occurred while creating the category.");
//   }
// });

// router.put("/:id", auth, async (req, res) => {
//   try {
//     console.log(
//       "Received request to update category:",
//       req.params.id,
//       req.body
//     );

//     const category = await prisma.category.findUnique({
//       where: { id: req.params.id },
//     });

//     if (!category) {
//       return res
//         .status(404)
//         .send("The category with the given id was not found.");
//     }

//     const validation = validateUpdateCategory({
//       id: req.params.id,
//       ...req.body,
//     });
//     if (!validation.success) {
//       console.log("Validation failed:", validation.error.errors);
//       return res
//         .status(400)
//         .send(validation.error.errors.map((err) => err.message).join(", "));
//     }

//     const { name } = req.body;
//     const updatedCategory = await prisma.category.update({
//       where: { id: req.params.id },
//       data: { name },
//     });

//     console.log("Category updated:", updatedCategory);
//     res.send(updatedCategory);
//   } catch (error) {
//     console.error("Error updating category:", error);
//     res.status(500).send("An error occurred while updating the category.");
//   }
// });

// router.delete("/:id", auth, async (req, res) => {
//   try {
//     console.log("Received request to delete category:", req.params.id);

//     const category = await prisma.category.findUnique({
//       where: { id: req.params.id },
//     });

//     if (!category) {
//       return res
//         .status(404)
//         .send("The category with the given id was not found.");
//     }

//     const itemsCount = await prisma.libraryItem.count({
//       where: { categoryId: req.params.id },
//     });

//     if (itemsCount > 0) {
//       return res
//         .status(400)
//         .send(
//           "Category cannot be deleted because it has associated library items."
//         );
//     }

//     const deletedCategory = await prisma.category.delete({
//       where: { id: req.params.id },
//     });

//     console.log("Category deleted:", deletedCategory);
//     res.send(deletedCategory);
//   } catch (error) {
//     console.error("Error deleting category:", error);
//     res.status(500).send("An error occurred while deleting the category.");
//   }
// });

// export default router;
