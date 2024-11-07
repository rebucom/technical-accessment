export interface LoggerConfig {
  label: string;
  logDirPath?: string;
  environment?: "development" | "production" | "test";
  maxSize?: string;
  maxFiles?: string;
  consoleLevel?: string;
  fileLevel?: string;
}

export interface LoggerStream {
  write(message: string): void;
}

export interface InventoryPayload {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface QueuedMessage {
  id: string;
  message: InventoryPayload;
  attempts: number;
  createdAt: Date;
}

export interface ClientMessage {
  userId: string;
  timestamp: number;
  data: any;
}

export interface ReadyBatch {
  id: string;
  data: QueuedMessage[];
}

export interface DatabaseService {
  batchInsert(messages: ClientMessage[]): Promise<void>;
}

export interface DatabaseTransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
  execute(query: string, params: any[]): Promise<any>;
  release(): void;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
}

export interface RetryMessage extends QueuedMessage {
  retryCount: number;
  lastRetryAt?: Date;
  error?: string;
}
