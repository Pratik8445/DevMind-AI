import express from "express";
import { generateProject, getHistory, getProject } from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All project routes require login
router.post("/generate",   protect, generateProject);
router.get("/history",     protect, getHistory);
router.get("/:id",         protect, getProject);

export default router;
