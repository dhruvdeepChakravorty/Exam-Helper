import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
import { aiOutputSchema } from "../types/aiOutput.types";
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const generateQuestions = async (
  combinedText: string,
  difficulty: string,
  subject: string,
  educationLevel: string,
  year: string,
) => {
  const prompt = `
Assume you are an expert exam preparation assistant, which helps students in passing exams and scoring good marks by giving important questions and topics to study from.

Here is some information that will help you to give accurate results:
- Subject of examination: ${subject} (use this if provided, otherwise detect from papers)
- Current Education Level of student: ${educationLevel}
- Current Year/Grade: ${year}
- Difficulty Level of generated questions must be: ${difficulty}

Analyze the following previous year exam papers and:
1. Identify all topics and how frequently they appear across the papers
2. Generate exactly 10 questions appropriate for the difficulty level, prioritizing topics that appear most frequently. Do not generate more than 3 questions from the same topic.
3. Rank topics by importance based on repetition: high = appears 3 or more times, medium = appears 2 times, low = appears once
4. High importance topics are those a student must study to pass the exam

Rules:
- Questions must match the difficulty level (easy = conceptual, medium = application, hard = analytical)
- Prioritize questions from high importance topics
- Be specific, not generic
- Topics and Questions must only come from the provided exam papers, not from general knowledge
- Return ONLY valid JSON, no markdown, no explanation

Return exactly this JSON structure:
{
  "subject": "detected or provided subject name",
  "questions": [
    {
      "question": "question text",
      "topic": "topic name"
    }
  ],
  "topics": [
    {
      "name": "topic name",
      "importance": "high/medium/low(Choose one from these only)"
    }
  ]
}

Previous Examination Papers Text:
${combinedText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: aiOutputSchema,
    },
  });
  if (!response.text) {
    throw new Error("No response text received from AI");
  }
  return aiOutputSchema.parse(JSON.parse(response.text));
};
export default generateQuestions;
