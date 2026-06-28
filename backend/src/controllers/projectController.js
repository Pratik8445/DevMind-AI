import { runWorkflow } from "../workflows/projectWorkflow.js";
import Project from "../models/Project.js";
import User    from "../models/User.js";

const GENERATION_COST = 5;

export async function generateProject(req, res) {
  try {
    const { idea } = req.body;
    const userId   = req.user._id;

    // Check credits
    const user = await User.findById(userId);
    if (user.credits < GENERATION_COST) {
      return res.status(402).json({
        error: `Not enough credits. You need ${GENERATION_COST} credits. You have ${user.credits}.`,
      });
    }

    // Deduct credits before running (prevents abuse)
    await User.findByIdAndUpdate(userId, { $inc: { credits: -GENERATION_COST } });

    // Run the 4-agent workflow
    const result = await runWorkflow(idea);

    // Save project to DB
    const project = await Project.create({
      user:         userId,
      idea,
      requirements: result.requirements,
      architecture: result.architecture,
      backend:      result.backend,
      qa:           result.qa,
    });

    res.json({ ...result, projectId: project._id });

  } catch (error) {
    // Refund credits if workflow failed
    await User.findByIdAndUpdate(req.user._id, { $inc: { credits: GENERATION_COST } });
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// GET /api/project/history — returns all projects for logged-in user
export async function getHistory(req, res) {
  try {
    const projects = await Project.find({ user: req.user._id })
      .sort({ createdAt: -1 })   // newest first
      .select("idea createdAt _id"); // only summary fields for the list

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET /api/project/:id — returns a single project
export async function getProject(req, res) {
  try {
    const project = await Project.findOne({
      _id:  req.params.id,
      user: req.user._id, // ensure user owns this project
    });

    if (!project) return res.status(404).json({ error: "Project not found." });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
