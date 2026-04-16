import { z } from "zod";

export const urlSchema = z.object({
  fileName: z.array(z.string()).max(10, "Maximum 10 files allowed"),
  fileType: z
    .array(z.enum(["application/pdf", "image/jpeg", "image/png"]))
    .max(10),
  fileHashes: z.array(z.string()).max(10),
});

export const confirmSchema = z.object({
  fileKeys: z.array(z.string()),
  fileHashes: z.array(z.string()),
  difficulty: z.enum(["easy", "medium", "hard"]),
  subject: z.string(),
  educationLevel: z.enum(["school", "college"]),
  year: z.string(),
});
