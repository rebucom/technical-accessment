import Queue, { Job } from "bull";
import pool from "../config/database";
import { processQueueBatch } from "../queue/processQueue";

export interface QueueData {
  msg_id: string;
  message: string;
  user_id: string;
  timestamp: string;
}

const queue_name = "dataQueue";
const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;

// Exit process if any required variable is missing
if (!(host && port && password)) {
  console.error("Error: Missing required Redis environment variables.");
  process.exit(1);
}
const dataQueue = new Queue<QueueData>(queue_name, {
  redis: {
    port: parseInt(port, 10),
    host,
    password,
  },
});

// Batch size threshold
const BATCH_SIZE_THRESHOLD = 1000;
const CHECK_INTERVAL = 5000; // Check every 5 seconds
// Periodically check the queue size
setInterval(async () => {
  const jobCounts = await dataQueue.getJobCounts();
  const { waiting } = jobCounts; // Jobs waiting to be processed

  if (waiting >= BATCH_SIZE_THRESHOLD) {
    console.log(
      `Queue size (${waiting}) reached the threshold. Processing batch now.`,
    );

    // Process the queue in batches
    processQueueBatch();
  } else {
    console.log(`Queue size (${waiting}) below threshold. Waiting...`);
  }
}, CHECK_INTERVAL);

export default dataQueue;
