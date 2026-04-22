import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../types/auth.types";
import AppError from "../utils/AppError";
import User from "../models/User";
import bcrypt from "bcrypt";
import generateToken from "../config/jwt";

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  const token = generateToken(newUser._id.toString());

  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .cookie(
      "user_meta",
      JSON.stringify({
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      }),
      {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    )
    .json({
      message: "User Created",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
};

export const loginUser = async (req: Request, res: Response) => {
  console.log(req.body);
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }

  const { identifier, password } = result.data;
  const foundUser = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!foundUser) {
    throw new AppError("User not found", 404);
  }

  const passwordCheck = await bcrypt.compare(password, foundUser.password);
  if (!passwordCheck) {
    throw new AppError("Wrong password", 401);
  }
  const token = generateToken(foundUser._id.toString());

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .cookie(
      "user_meta",
      JSON.stringify({
        id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
      }),
      {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    )
    .json({
      message: "Logged in",
      user: {
        id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
      },
    });
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token").clearCookie('user_meta').status(200).json({ message: "Logged out" });
};
