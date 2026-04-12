import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fileKey: {
      type: String,
      required: true,
    },
    fileHash: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    results: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
