import { DetectDocumentTextCommand } from "@aws-sdk/client-textract";
import { textract } from "../config/awsClient";
import { env } from "../config/env";

export const extractTextFromS3 = async (fileKey: string): Promise<string> => {
  const textractResponse = await textract.send(
    new DetectDocumentTextCommand({
      Document: {
        S3Object: {
          Bucket: env.AWS_S3_BUCKET_NAME,
          Name: fileKey,
        },
      },
    }),
  );

  const text =
    textractResponse.Blocks?.filter((block) => block.BlockType === "LINE")
      .map((block) => block.Text)
      .join("/n") || "";

  if (!text) {
    throw new Error(
      "Textract Returned no text, Document may be empty or unreadable",
    );
  }

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
