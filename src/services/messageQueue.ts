import Queue, { Job } from 'bull';
import pool from '../config/database';

export interface QueueData {
  msg_id: string;
  message: string;
  user_id: string;
  timestamp: string;
}

const queue_name = 'dataQueue';
const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT
const password = process.env.REDIS_PASSWORD

// Exit process if any required variable is missing
if (!(host && port && password)) {
  console.error('Error: Missing required Redis environment variables.');
  process.exit(1);
}
const dataQueue = new Queue<QueueData[]>(queue_name, {
  redis: {    
    port: parseInt(port, 10),
    host ,
    password , 
  },
});

// Process the items in queue, in batches
dataQueue.process(async (job: Job<QueueData[]>) => {
  const dataBatch = job.data;

  try {
    const connection =await pool.getConnection();

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
      msg_id VARCHAR(255) PRIMARY KEY,
      message TEXT,
      user_id VARCHAR(255),
      timestamp DATETIME
    );
  `;
  
  await connection.query(createTableQuery);

    await connection.query(
      'INSERT IGNORE INTO messages (msg_id, message, user_id, timestamp) VALUES ?',
      [dataBatch.map((item) =>[item.msg_id, item.message, item.user_id, item.timestamp] )]
    );
    connection.release();
  } catch (error) {
    console.error('Batch write error:', error);
  }
});

export default dataQueue;
