import { QueueData } from "../services/messageQueue";
import pool from "../config/database";

const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

//  process a batch
async function processBatch(dataBatch: QueueData[]): Promise<void> {
  if (dataBatch.length === 0) {
    console.info("No data to process.");
    return;
  }

  // Begin batch processing
  const connection = await pool.getConnection();
  try {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
      msg_id VARCHAR(255) PRIMARY KEY,
      message TEXT,
      user_id VARCHAR(255),
      timestamp TIMESTAMP
    );
  `;

    await connection.query(createTableQuery);

    const [query, qax] = await connection.query(
      "INSERT INTO messages (msg_id, message, user_id, timestamp) VALUES ? ON DUPLICATE KEY UPDATE msg_id=VALUES(msg_id)",
      [
        dataBatch.map((item) => [
          item.msg_id,
          item.message,
          item.user_id,
          formatTimestamp(item.timestamp),
        ]),
      ],
    );

    console.log(`${dataBatch.length} records successfully processed.`);
  } catch (error) {
    console.error("Batch write error:", error);
  } finally {
    connection.release();
  }
}

export { processBatch };
