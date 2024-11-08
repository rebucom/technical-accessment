import mysql from 'mysql2/promise';
import config from './config.js';
import createMessagesTable from './src/models/message.js';

export const pool = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  // password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(createMessagesTable);
    connection.release();
    createLogger.info('Database initialized successfully');
  } catch (error) {
    createLogger.error('Database initialization error:', error);
    process.exit(1);
  }
};
