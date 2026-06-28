import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    idea: {
      type:     String,
      required: true,
    },
    requirements: { type: String, default: "" },
    architecture: { type: String, default: "" },
    backend:      { type: String, default: "" },
    qa:           { type: String, default: "" },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
