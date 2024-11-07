import { QueuedMessage, ReadyBatch } from "../../../types";
import { DatabaseConnection } from "../db";
import queries from "../db/queries";
import EventBroker from "../events/eventBroker";
import * as mysql from "mysql2/promise";

export class InventoryConsumer {
  private broker: EventBroker;
  private db: DatabaseConnection;

  constructor(broker: EventBroker, db: DatabaseConnection) {
    this.broker = broker;
    this.db = db;
    this.subscribeToBrokerEvents();
  }

  private subscribeToBrokerEvents(): void {
    logger.info("Inventory Consumer is subscribed to Event Broker");

    this.broker.on("update-inventory", this.updateInventory.bind(this));
    this.broker.on("queue-error", this.handleQueueError.bind(this));
  }

  private async updateInventory(data: ReadyBatch): Promise<void> {
    logger.info(`Processing Inventory Data of: ${data.id}`);
    for (const message of data.data) {
      await this.saveToDatabase(message);
    }
  }

  private handleQueueError(error: Error): void {
    console.error(
      "InventoryConsumer encountered an error in the queue:",
      error,
    );
  }

  private async saveToDatabase(message: QueuedMessage): Promise<void> {
    const { productId, productName, quantity, price } = message.message;
    const connection = await this.db.getConnection();

    try {
      await connection.beginTransaction();

      await connection.execute(queries.insertInventory, [
        productId,
        productName,
        quantity,
        price,
      ]);

      await connection.commit();
      logger.info(`Message ${message.id} saved successfully.`);

      this.broker.emit("inventory-updated", message);
    } catch (error) {
      await connection.rollback();
      logger.error(
        `Error saving message ${message.id} to the database:`,
        error,
      );

      this.broker.emit("inventory-update-failed", { message, error });
    } finally {
      connection.release();
    }
  }
}
