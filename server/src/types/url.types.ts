import { z } from "zod";

export const urlSchema = z.object({
  fileName: z.array(z.string()).max(10,"Maximum 10 files allowed"),
  fileType: z.array(z.string()).max(10),
  fileHash: z.array(z.string()).max(10),
});

export const confirmSchema = z.object({
  fileKeys: z.array(z.string()),
  fileHashes:z.array(z.string()),
  difficulty: z.enum(["easy", "medium", "hard"]),
});
