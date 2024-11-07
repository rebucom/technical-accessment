import EventEmitter from "events";
import { QueuedMessage, RetryConfig, RetryMessage } from "../../../types";
import { DatabaseConnection } from "../db";

export class RetryManager extends EventEmitter {
  private retryQueue: Map<string, RetryMessage>;
  private config: RetryConfig;
  private db: DatabaseConnection;

  constructor(
    db: DatabaseConnection,
    config: RetryConfig = { maxRetries: 3, retryDelay: 5000 },
  ) {
    super();
    this.db = db;
    this.config = config;
    this.retryQueue = new Map();
    this.startRetryProcess();
  }

  async addToRetryQueue(message: QueuedMessage, error: string): Promise<void> {
    const retryMessage: RetryMessage = {
      ...message,
      retryCount: 0,
      error,
      lastRetryAt: new Date(),
    };

    this.retryQueue.set(message.id, retryMessage);
    await this.saveRetryMessage(retryMessage);
  }

  private async saveRetryMessage(message: RetryMessage): Promise<void> {
    try {
      await this.db.execute(
        "INSERT INTO retry_queue (message_id, retry_count, last_retry_at, error, message_data) VALUES (?, ?, ?, ?, ?)",
        [
          message.id,
          message.retryCount,
          message.lastRetryAt,
          message.error,
          JSON.stringify(message),
        ],
      );
    } catch (error) {
      logger.error(`Failed to save retry message ${message.id}:`, error);
    }
  }

  private async startRetryProcess(): Promise<void> {
    setInterval(async () => {
      for (const [id, message] of this.retryQueue.entries()) {
        if (await this.shouldRetry(message)) {
          await this.processRetry(message);
        }
      }
    }, this.config.retryDelay);
  }

  private async shouldRetry(message: RetryMessage): Promise<boolean> {
    return message.retryCount < this.config.maxRetries;
  }

  private async processRetry(message: RetryMessage): Promise<void> {
    message.retryCount++;
    message.lastRetryAt = new Date();

    this.emit("retry-attempt", message);
    await this.updateRetryMessage(message);
  }

  private async updateRetryMessage(message: RetryMessage): Promise<void> {
    try {
      await this.db.execute(
        "UPDATE retry_queue SET retry_count = ?, last_retry_at = ? WHERE message_id = ?",
        [message.retryCount, message.lastRetryAt, message.id],
      );
    } catch (error) {
      logger.error(`Failed to update retry message ${message.id}:`, error);
    }
  }
}
