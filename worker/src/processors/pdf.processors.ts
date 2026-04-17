import { Job } from "bullmq";
import JobModel from "../models/Job";
import { extractTextFromS3 } from "./textract";
import { generateQuestions } from "./gemini";

export const processPdf = async (job: Job) => {
  const { jobId, fileKeys, difficulty, subject, educationLevel, year } = job.data
  console.log("Processing job:", jobId)
  
  await JobModel.findByIdAndUpdate(jobId, { status: "processing" })
  
  try {
    console.log("Fetching from S3 and running Textract...")
    const texts = await Promise.all(
      fileKeys.map((fileKey: string) => extractTextFromS3(fileKey))
    )
    console.log("Textract done, combined text length:", texts.join("\n\n").length)
    
    console.log("Sending to Gemini...")
    const combinedText = texts.join("/n/n");

    const results = await generateQuestions(combinedText, difficulty, subject, educationLevel, year)
    console.log("Gemini done")
    
    await JobModel.findByIdAndUpdate(jobId, { status: "completed", results })
  } catch (error) {
    console.error("Processing error:", error)
    await JobModel.findByIdAndUpdate(jobId, {
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    })
    throw error
  }
}