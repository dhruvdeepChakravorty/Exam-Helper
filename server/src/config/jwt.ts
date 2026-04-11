import jwt from "jsonwebtoken";
import { env } from "./env";

const generateToken = (userId: string) => {
  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error("Secret Key not found");
  }

  const token = jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
  return token;
};

export default generateToken;
