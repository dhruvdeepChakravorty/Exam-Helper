import { Queue } from "bullmq";
import redisConnection from "../config/redis";

const pdfQueue = new Queue("pdf-processing",{
    connection:redisConnection
}) 

export default pdfQueue