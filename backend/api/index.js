// Importing dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "../src/routes/user.routes.js";
import noteRouter from "../src/routes/note.routes.js";
import connectDB from "../src/config/db.js";
import helmet from "helmet"; // Import Helmet

import cookieParser from "cookie-parser";

dotenv.config(); // Load environment variables from the .env file

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet()); // Use Helmet for security

// Routes
app.use("/api/user", userRouter);

app.use("/api/note", noteRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the notemaking app");
});

const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Server is listening on port ${PORT}`);
// });
connectDB();

export default app;
