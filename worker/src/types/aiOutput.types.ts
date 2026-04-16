import { z } from "zod";

export const aiOutputSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "A clear exam question based on the selected difficulty level, picked from the most repeated topics",
          ),
        topic: z.string().describe("The topic this question belongs to"),
      }),
    )
    .length(10)
    .describe(
      "Exactly 10 important questions a student must study to pass the exam",
    ),
  topics: z
    .array(
      z.object({
        name: z.string().describe("Topic name found in the exam papers"),
        importance: z
          .enum(["high", "medium", "low"])
          .describe(
            "high = appears most frequently across papers, medium = appears moderately, low = appears rarely",
          ),
      }),
    )
    .describe(
      "All topics found across all uploaded papers ranked by how frequently they appear",
    ),
});

export type aiResponse = z.infer<typeof aiOutputSchema>;
