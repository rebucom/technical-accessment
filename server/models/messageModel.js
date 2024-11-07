const db = require('../config/dbConfig');

/**
 * Create table to store data
 */
const createMessageTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
    await db.execute(query);
};

/**
 * Simple function to insert string message by user_id
 * @param {} messages 
 * @returns Promise<[QueryResult, FieldPacket[]]>
 */
const insertMessages = async (messages) => {
    const query = `INSERT INTO messages (user_id, message) VALUES ?`;
    const values = messages.map((msg) => [msg.user_id, msg.message]);
    return db.query(query, [values]);
};

module.exports = {
    createMessageTable,
    insertMessages,
};
