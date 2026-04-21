import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fileKeys: {
      type: [String],
      required: true,
    },
    fileHashes: {
      type: [String],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    educationLevel: {
      type: String,
      enum: ["school", "college"],
      required: true,
    },
    year: { type: String, required: true },
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
    extractedText: { type: String, default: null },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
