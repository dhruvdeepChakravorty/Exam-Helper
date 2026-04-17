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
  const { fileName, fileType, fileHashes } = result.data;

  const existingJob = await Job.findOne({
    fileHashes: { $all: fileHashes, $size: fileHashes.length },
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
  const { fileKeys, fileHashes, difficulty, subject, educationLevel, year } =
    result.data;

  const userId = req?.user?.id;
  const newJob = await Job.create({
    userId,
    fileKeys,
    fileHashes,
    difficulty,
    subject,
    educationLevel,
    year,
    status: "pending",
  });

  await pdfQueue.add("process-pdf", {
    jobId: newJob._id,
    fileKeys: newJob.fileKeys,
    difficulty: newJob.difficulty,
    subject: newJob.subject,
    educationLevel: newJob.educationLevel,
    year: newJob.year,
  });

  res.status(201).json({ message: "Job created", data: { jobId: newJob._id } });
};
