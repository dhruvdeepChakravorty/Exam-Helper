import { z } from "zod";

export const urlSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileHash: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const confirmSchema = z.object({
  fileKey: z.string(),
  fileHash: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});
