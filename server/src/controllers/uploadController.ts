import { Request, Response } from "express";
import { confirmSchema, urlSchema } from "../types/url.types";
import AppError from "../utils/AppError";
import Job from "../models/Job";
import { generatePresignedUrls } from "../config/uploadService";
import pdfQueue from "../queues/pdfQueue";

export const fileUploadUrl = async (req: Request, res: Response) => {
  const result = urlSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }
  const { fileName, fileType, fileHash } = result.data;

  const existingJob = await Job.findOne({
    fileHash: { $in: fileHash },
    status: "completed",
  });
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

  const files = await generatePresignedUrls(fileType, fileName);

  res.status(200).json({
    message: "Upload URL generated",
    data: {
      files,
    },
  });
};

export const uploadConfirm = async (req: Request, res: Response) => {
  const result = confirmSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }
  const { fileKeys, fileHashes, difficulty } = result.data;

  const userId = req?.user?.id;
  const newJob = await Job.create({
    userId,
    fileKeys,
    fileHashes,
    difficulty,
    status: "pending",
  });

  await pdfQueue.add("process-pdf", {
    jobId: newJob._id,
    fileKeys: newJob.fileKeys,
    difficulty: newJob.difficulty,
  });

  res.status(201).json({ message: "Job created", data: { jobId: newJob._id } });
};
