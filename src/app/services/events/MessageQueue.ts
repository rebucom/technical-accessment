import EventEmitter from "events";
import {
  ClientMessage,
  InventoryPayload,
  QueuedMessage,
  ReadyBatch,
} from "../../../types";
import { v4 as uuidv4 } from "uuid";

export class MessageQueue extends EventEmitter {
  private queue: Map<string, QueuedMessage> = new Map();
  private batchSize: number;
  private batchInterval: number;
  private processing: boolean = false;
  constructor(batchSize: number, batchInterval: number) {
    super();
    this.batchSize = batchSize;
    this.batchInterval = batchInterval;
    this.startProcess();
  }

  private getBatch() {
    const ready: ReadyBatch = {
      id: uuidv4(),
      data: [],
    };

    let count = 0;
    for (const [id, queuedMessage] of this.queue) {
      if (count >= this.batchSize) break;
      ready.data.push(queuedMessage);
      this.queue.delete(id);
      count++;
    }
    return ready;
  }

  public async startProcess(): Promise<void> {
    logger.info("Messaging Queue is started");
    if (this.processing) return;
    this.processing = true;

    while (true) {
      try {
        if (this.queue.size >= this.batchSize) {
          const newBatch = await this.getBatch();

          this.emit("batch", newBatch);
        }
        await new Promise((resolve) => setTimeout(resolve, this.batchInterval));
      } catch (error) {
        logger.error(`Error processing queue: ${error}`);
      }
    }
  }
  public enqueue(message: InventoryPayload): void {
    const queuedMessage: QueuedMessage = {
      id: uuidv4(),
      message,
      attempts: 0,
      createdAt: new Date(),
    };
    this.queue.set(queuedMessage.id, queuedMessage);
  }
}
