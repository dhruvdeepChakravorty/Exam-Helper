import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";


const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
  
  
};

export default errorHandler;
