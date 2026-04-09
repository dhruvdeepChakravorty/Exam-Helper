import { Request, Response } from "express";
import { registerSchema } from "../types/auth.types";
import AppError from "../utils/AppError";
import User from "../models/user";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }
  const { username, email, password } = result.data;

  const checkEmailAlready = await User.findOne({ email });
  if (checkEmailAlready) {
    throw new AppError("User already exist, Please log in", 400);
  }

  const hashedPassword = await bcrypt.hash(password,10)

  
};
