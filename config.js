import dotenv from 'dotenv';

dotenv.config();

console.log('password:', process.env.DB_PASSWORD);

const config = {
  PORT: process.env.PORT || 4000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'your_username',
  DB_PASSWORD: process.env.DB_PASSWORD || 'your_password',
  DB_NAME: process.env.DB_NAME || 'your_db_name',
  BATCH_SIZE: parseInt(process.env.BATCH_SIZE) || 100,
  PROCESS_INTERVAL: parseInt(process.env.PROCESS_INTERVAL) || 30000,
};

export default config;
