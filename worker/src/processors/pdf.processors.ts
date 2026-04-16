import { Job } from "bullmq";
import JobModel from "../models/Job";
import { extractTextFromS3 } from "./textract";
import { generateQuestions } from "./gemini";

export const processPdf = async (job: Job) => {
  const { jobId, fileKeys, difficulty, subject, educationLevel,year } = job.data;
  await JobModel.findByIdAndUpdate(jobId, { status: "processing" });
  try {
    const texts = await Promise.all(
      fileKeys.map((filekey: string) => extractTextFromS3(filekey)),
    );
    const combinedText = texts.join("/n/n");
    const result = await generateQuestions(combinedText, difficulty,subject, educationLevel,year);

    await JobModel.findByIdAndUpdate(jobId, {
      status: "copleted",
      results: result,
    });
  } catch (error) {
    await JobModel.findByIdAndUpdate(jobId, {
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};
