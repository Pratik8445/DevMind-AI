import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB }   from "./config/db.js";
import projectRoutes   from "./routes/projectRoutes.js";
import authRoutes      from "./routes/authRoutes.js";
import paymentRoutes   from "./routes/paymentRoutes.js";

// Connect to MongoDB first
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",    authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
