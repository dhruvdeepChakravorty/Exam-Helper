import {
  DetectDocumentTextCommand,
  GetDocumentTextDetectionCommand,
  StartDocumentTextDetectionCommand,
} from "@aws-sdk/client-textract";
import { textract } from "../config/awsClient";
import { env } from "../config/env";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const extractTextFromS3 = async (fileKey: string): Promise<string> => {
  const startResponse = await textract.send(
    new StartDocumentTextDetectionCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: env.AWS_S3_BUCKET_NAME,
          Name: fileKey,
        },
      },
    }),
  );

  const textractJobId = startResponse.JobId;
  if (!textractJobId) {
    throw new Error("Failed to Start textract job");
  }

  let status = "IN_PROGRESS";
  let blocks: any[] = [];
  let nextToken: string | undefined;

  while (status === "IN_PROGRESS") {
    await sleep(3000);
    const result = await textract.send(
      new GetDocumentTextDetectionCommand({
        JobId: textractJobId,
      }),
    );
    status = result.JobStatus || "FAILED";

    if (status === "SUCCEEDED") {
      if (result.Blocks) blocks.push(...result.Blocks);
      nextToken = result.NextToken;

      while (nextToken) {
        const nextPage = await textract.send(
          new GetDocumentTextDetectionCommand({
            JobId: textractJobId,
            NextToken: nextToken,
          }),
        );
        if (nextPage.Blocks) blocks.push(...nextPage.Blocks);
        nextToken = nextPage.NextToken;
      }
    }
  }

  const text =
    blocks
      .filter((block) => block.BlockType === "LINE")
      .map((block) => block.Text)
      .join("\n") || "";

  if (!text)
    throw new Error(
      "Textract returned no text — document may be empty or unreadable",
    );

  return text;
};

/* (For futute use to alternate to free usage)
import Tesseract from 'tesseract.js'
  import { fromBuffer } from 'pdf-poppler' 
  

  const images = await fromBuffer(Buffer.from(fileBytes), { format: 'jpeg' })
  
 
  const texts = await Promise.all(
    images.map(img => Tesseract.recognize(img, 'eng').then(r => r.data.text))
  )
    if (!texts) {
    throw new Error(
      "Tesseract Returned no text, Document may be empty or unreadable",
    );
  }
  return texts.join("\n") */
