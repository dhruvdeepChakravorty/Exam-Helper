import { Request, Response } from "express";
import {confirmSchema, urlSchema} from "../types/url.types";
import AppError from "../utils/AppError";
import Job from "../models/Job";
import { generatePresignedUrl } from "../config/uploadService";

export const uploadFileUrl = async (req: Request, res: Response) => {
  const result = urlSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }
  const { fileName, fileType, fileHash, difficulty } = result.data;

  const existingJob = await Job.findOne({ fileHash, status: "completed" });
  if (existingJob) {
    return res.status(200).json({
      message: "Job already exist",
      job: {
        duplicate: true,
        jobId: existingJob._id,
        results: existingJob.results,
      },
    });
  }

  const { presignedUrl, fileKey } = await generatePresignedUrl(
    fileType,
    fileName,
  );

  res.status(200).json({
    message: "Upload URL generated",
    data: {
      presignedUrl,
      fileKey,
    },
  });
};

export const uploadConfirm = async (req: Request, res: Response) =>{
  const result = confirmSchema.safeParse(req.body)
  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }
  const {fileKey,fileHash,difficulty}=result.data
  
 
  
}
