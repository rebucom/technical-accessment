import { pool } from '../../connectDB.js';

/**
 * Inserts multiple messages into the messages table.
 *
 * @param {Array} messages - An array of message objects, each containing a userId and content.
 * @returns {Object} The result of the database query.
 * @throws Will throw an error if there is an issue with the database query.
 */
export const createMessages = async (messages) => {
  const connection = await pool.getConnection();
  try {
    const query = 'INSERT INTO messages (user_id, content) VALUES ?';
    const values = messages.map((msg) => [msg.userId, msg.content]);
    const [result] = await connection.query(query, [values]);
    return result;
  } catch (error) {
    throw new Error(`Error creating messages: ${error.message}`);
  } finally {
    connection.release();
  }
};

/**
 * Fetches all messages associated with a given user ID.
 *
 * @param {String} userId - The ID of the user whose messages to fetch.
 * @returns {Array} An array of message objects, ordered by created_at in descending order.
 * @throws Will throw an error if there is an issue with the database query.
 */
export const getMessagesByUserId = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  } catch (error) {
    throw new Error(`Error fetching messages: ${error.message}`);
  } finally {
    connection.release();
  }
};
