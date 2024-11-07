import express, { Express } from "express";
import appConfig from "./config/app";
import Logger from "./config/logger";

const app: Express = express();

declare global {
  var logger: ReturnType<typeof Logger.createLogger>;
}

global.logger = Logger.createLogger({ label: "Messaging Queuing Service" });

appConfig(app);

export default app;
