import "dotenv/config";
import { setServers } from "dns"
setServers(["8.8.8.8", "8.8.4.4"])

import dbConnect from "./config/dbConnect";
import { Worker } from "bullmq";
import { processPdf } from "./processors/pdf.processors";
import redisConnection from "./config/redis";
import { Queue } from "bullmq";

const pdfQueue = new Queue("pdf-processing",{
    connection:redisConnection
}) 
dbConnect();

const worker = new Worker("pdf-processing", processPdf, {
  connection: redisConnection,
});

worker.on("completed", (job) => {
  console.log(`Job: ${job.id} completed`);
});

worker.on("failed", (job,err) => {
  console.error(`Job: ${job?.id} failed`, err.message);
});


