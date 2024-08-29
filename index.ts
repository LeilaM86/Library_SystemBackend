import express from "express";
import cors from "cors";
import auth from "./routes/auth";
import users from "./routes/users";
import categories from "./routes/categories";
import libraryItems from "./routes/libraryItems";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://library-system-frontend-4iuq.onrender.com",
    ],
  })
);
app.use(express.json());
app.use("/api/categories", categories);
app.use("/api/library-items", libraryItems);
app.use("/api/users", users);
app.use("/api/auth", auth);

const PORT = process.env.PORT || 7578;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
