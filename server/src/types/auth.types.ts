import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(4).trim(),
  email: z.email().trim(),
  password: z.string().min(4).trim(),
});
