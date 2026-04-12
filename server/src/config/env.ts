import { z } from "zod";

const envSchema = z.object({
  MONGO_URI: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),
  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),
});

const parsed = envSchema.safeParse(process.env)


if (!parsed.success) {
   console.error("Missing ENV variables")
   console.error(parsed.error.issues)
   process.exit(1)
}

export const env = parsed.data