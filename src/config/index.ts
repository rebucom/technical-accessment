import { config } from "dotenv";
config();

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  BATCH_SIZE: 2,
  BATCH_INTERVAL: 5,
  MAX_RETRIES: 3,
  SOCKET_PATH: "/ws",
  URL: process.env.DB_URL || "string",
  DATABASE: process.env.DATABASE || "msg_quue",
  RetryConfig: {
    maxRetries: 3,
    retryDelay: 5000,
  },
};
