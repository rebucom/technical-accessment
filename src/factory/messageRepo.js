import { pool } from '../../connectDB.js';

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
