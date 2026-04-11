import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "./s3";

export const generatePresignedUrl = async (
  filetype: string,
  filename: string,
) => {
  const fileExtension = filename.split(".").pop();
  const filekey = `uploads/${uuidv4()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: filekey,
    ContentType: filetype,
  });

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return { presignedUrl, filekey };
};
