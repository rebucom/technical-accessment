const db = require('../config/database');

const queue = [];
const BATCH_SIZE = 100;

const addToQueue = (message) => {
  queue.push(message);
};

const writeBatchToDatabase = async (batch) => {
  const query = 'INSERT INTO messages (user_id, data) VALUES ?';
  const values = batch.map((msg) => [msg.user_id, JSON.stringify(msg.data)]);
  await db.query(query, [values]);
};

const processQueue = async () => {
  if (queue.length > 0) {
    const batch = queue.splice(0, BATCH_SIZE);
    try {
      await writeBatchToDatabase(batch);
      console.log(`Batch of ${batch.length} messages written to the database.`);
    } catch (error) {
      console.error('Error writing batch to database:', error);
    }
  }
};

module.exports = { addToQueue, processQueue };
