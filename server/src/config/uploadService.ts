import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "./s3";

export const generatePresignedUrl = async (
  fileType: string,
  fileName: string,
) => {
  const fileExtension = fileName.split(".").pop();
  const fileKey = `uploads/${uuidv4()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
  });

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return { presignedUrl, fileKey };
};

export const generatePresignedUrls = async (
  fileTypes: string[],
  fileNames: string[],
) => {
  return Promise.all(
    fileTypes.map((fileType, i) =>
      generatePresignedUrl(fileType, fileNames[i]),
    ),
  );
};
