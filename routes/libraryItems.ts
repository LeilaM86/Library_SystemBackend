import express from "express";
import { PrismaClient } from "@prisma/client";
import cuid from "cuid";
import { LibraryItemData, libraryItemSchema } from "../schema/LibraryItems";
import auth from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    console.log("Received request to get all library items");

    const libraryItems = await prisma.libraryItem.findMany();

    console.log("Library items fetched:", libraryItems);
    res.status(200).send(libraryItems);
  } catch (error) {
    console.error("Error fetching library items:", error);
    res.status(500).send("An error occurred while fetching library items.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("Received request to get library item:", req.params.id);

    const libraryItem = await prisma.libraryItem.findUnique({
      where: { id: req.params.id },
    });

    if (!libraryItem) {
      return res.status(404).send("Library item not found.");
    }

    console.log("Library item fetched:", libraryItem);
    res.status(200).send(libraryItem);
  } catch (error) {
    console.error("Error fetching library item:", error);
    res.status(500).send("An error occurred while fetching the library item.");
  }
});

router.post("/", auth, async (req, res) => {
  const newItem = req.body;

  if (!newItem.id) {
    newItem.id = cuid();
  }

  try {
    console.log("Received request to create a library item:", req.body);

    const validation = libraryItemSchema.safeParse(req.body);
    if (!validation.success) {
      console.log("Validation failed:", validation.error.errors);
      return res
        .status(400)
        .send(validation.error.errors.map((issue) => issue.message).join(", "));
    }

    const data: LibraryItemData = validation.data;

    const libraryItem = await prisma.libraryItem.create({
      data: {
        title: data.title,
        abbreviation: data.abbreviation,
        type: data.type,
        isBorrowable: data.isBorrowable,
        borrower: data.borrower || null,
        borrowDate: data.borrowDate ? new Date(data.borrowDate) : null,
        author: data.author || null,
        nbrPages: data.nbrPages || null,
        runTimeMinutes: data.runTimeMinutes || null,
        categoryId: data.categoryId,
      },
    });

    console.log("Library item created:", libraryItem);
    res.status(201).send(libraryItem);
  } catch (error) {
    console.error("Error creating library item:", error);
    res.status(500).send("An error occurred while creating the library item.");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    console.log("uppdatera bok i db");
    // Validera inkommande data
    const validation = libraryItemSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res.status(400).send(`Validation failed: ${errors}`);
    }

    const { id } = req.params;
    let data = req.body;

    // Omvandla borrowDate till Date om det är en sträng
    if (data.borrowDate && typeof data.borrowDate === "string") {
      data.borrowDate = new Date(data.borrowDate);
    }

    // Uppdatera objektet i databasen
    const updatedItem = await prisma.libraryItem.update({
      where: { id },
      data,
    });

    res.send(updatedItem);
  } catch (error) {
    console.error("Error updating library item:", error);
    res.status(500).send("An error occurred while updating the library item.");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    console.log("Received request to delete library item:", req.params.id);

    const libraryItem = await prisma.libraryItem.findUnique({
      where: { id: req.params.id },
    });

    if (!libraryItem) {
      return res.status(404).send("Library item not found.");
    }

    await prisma.libraryItem.delete({
      where: { id: req.params.id },
    });

    console.log("Library item deleted:", req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting library item:", error);
    res.status(500).send("An error occurred while deleting the library item.");
  }
});

export default router;
