import "dotenv/config";
import dbConnect from "./config/dbConnect";
import { Worker } from "bullmq";
import { processPdf } from "./processors/pdf.processors";
import redisConnection from "./config/redis";

dbConnect();

const worker = new Worker("process-pdf", processPdf, {
  connection: redisConnection,
});

worker.on("completed", (job) => {
  console.log(`Job: ${job.id} completed`);
});

worker.on("failed", (job,err) => {
  console.error(`Job: ${job?.id} failed`, err.message);
});
