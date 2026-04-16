import { ConnectionOptions } from "bullmq";
import { env } from "./env";

const redisConnection: ConnectionOptions = {
    url:env.REDIS_URL
}

export default redisConnection