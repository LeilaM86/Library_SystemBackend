import express from "express";
import cors from "cors";
import auth from "./routes/auth";
import users from "./routes/users";
import categories from "./routes/categories";
import libraryItems from "./routes/libraryItems";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/categories", categories);
app.use("/api/library-items", libraryItems);
app.use("/api/users", users);
app.use("/api/auth", auth);

const PORT = process.env.PORT || 7577;

app.listen(PORT, () => console.log("Listening on port " + PORT));
