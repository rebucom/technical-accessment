import express, { Application } from "express";
import { Server as HttpServer, createServer } from "http";
import { CONFIG } from ".";
import { SocketService } from "../app/socket";
import EventBroker from "../app/services/events/eventBroker";
import { DatabaseConnection } from "../app/services/db";
import { InventoryConsumer } from "../app/services/inventory/inventoryConsumer";
import { MessageQueue } from "../app/services/events/MessageQueue";

const path = require("path");

const appConfig = async (app: Application) => {
  app.use(express.static(path.join(__dirname, "../public")));

  const server = createServer(app);

  const db = await new DatabaseConnection(CONFIG.DATABASE);

  await db.connect();

  await db
    .setupDB()
    .then(() => {
      logger.info("Database Setup is Complete");
    })
    .catch((err: Error) => logger.error("Unable to setup Database", err));

  const msgQueue = new MessageQueue(CONFIG.BATCH_SIZE, CONFIG.BATCH_INTERVAL);

  const broker = new EventBroker(msgQueue);

  new InventoryConsumer(broker, db);

  new SocketService(server, msgQueue);

  server.listen(CONFIG.PORT, () => {
    logger.info(`Server is running at http://localhost:${CONFIG.PORT}`);
  });
};

export default appConfig;
