import { Request, Response } from "express";
import Job from "../models/Job";
import AppError from "../utils/AppError";

export const getJobStatus = async (req:Request, res:Response) => {
    const {jobId} = req.params
    const job = await Job.findById(jobId)
    if (!job) {
        throw new AppError("Job not found",404)
    }

    res.status(200).json({
        data:{
            status:job.status,
            results:job.results,
            errorMessage: job.errorMessage
        }
    })
}