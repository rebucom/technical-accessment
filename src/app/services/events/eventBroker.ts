import { EventEmitter } from "events";
import { ClientMessage, QueuedMessage, ReadyBatch } from "../../../types";
import { MessageQueue } from "./MessageQueue";

export class EventBroker extends EventEmitter {
  private messageQueue: MessageQueue;

  constructor(messageQueue: MessageQueue) {
    super();
    this.messageQueue = messageQueue;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    logger.info("Broker Service is Started");
    this.messageQueue.on("batch", this.handleInventoryUpdate.bind(this));
    this.messageQueue.on("error", this.handleQueueError.bind(this));
    this.on("inventory-update-failed", this.handleDatabaseSaveError.bind(this));
  }

  private handleDatabaseSaveError(payload: {
    message: QueuedMessage;
    error: Error;
  }): void {
    const { message, error } = payload;
    logger.error(`Error saving message ${message.id} to the database:`, error);
  }

  private handleInventoryUpdate(messages: ReadyBatch): void {
    logger.info(
      `Event Broker received batch of ${messages.data.length} messages`,
    );
    this.emit("update-inventory", messages);
  }

  private handleQueueError(error: Error): void {
    logger.error("Event Broker encountered an error:", error);

    this.emit("queue-error", error);
  }
}

export default EventBroker;
