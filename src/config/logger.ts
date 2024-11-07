import {
  Logger as WinstonLogger,
  createLogger,
  transports,
  format,
} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { deflate } from "zlib";
import { path } from "app-root-path";
import { existsSync, mkdirSync } from "fs";
import { LoggerConfig } from "../types";

const { combine, timestamp, label, printf, json, colorize, splat } = format;

class LoggerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoggerError";
  }
}

class Logger {
  private static instance: Logger;
  private readonly label: string;
  private readonly logDirPath: string;
  private readonly environment: string;
  private logger: WinstonLogger | null = null;

  private readonly logFormat = printf(
    ({ level, message, label, timestamp }) => {
      return `${timestamp} [${level}] [${label}]: ${message}`;
    },
  );

  private constructor(config: LoggerConfig) {
    this.label = config.label;
    this.logDirPath = this.initializeLogDirectory(config.logDirPath);
    this.environment = config.environment?.toLowerCase() || "development";
  }

  private initializeLogDirectory(dirPath?: string): string {
    const logPath = dirPath || `${path}/logs`;
    if (!existsSync(logPath)) {
      try {
        mkdirSync(logPath, { recursive: true });
      } catch (error: any) {
        throw new LoggerError(
          `Failed to create log directory: ${error.message}`,
        );
      }
    }
    return logPath;
  }

  private getTransportOptions(config: LoggerConfig) {
    return {
      console: {
        level: config.consoleLevel || "debug",
        handleExceptions: true,
        format: combine(
          colorize(),
          splat(),
          label({ label: this.label }),
          timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          this.logFormat,
        ),
      },
      file: {
        level: config.fileLevel || "debug",
        filename: `${this.logDirPath}/${this.environment}-%DATE%-app.log`,
        maxSize: config.maxSize || "20m",
        maxFiles: config.maxFiles || "14d",
        json: true,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        handleExceptions: true,
        format: combine(
          splat(),
          json(),
          label({ label: this.label }),
          timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          this.logFormat,
        ),
      },
    };
  }

  public init(): WinstonLogger {
    if (this.logger) {
      return this.logger;
    }

    const transportOptions = this.getTransportOptions({
      label: this.label,
      environment: this.environment as "development" | "production" | "test",
    });

    this.logger = createLogger({
      format: combine(timestamp(), label({ label: this.label })),
      transports: [
        new transports.Console(transportOptions.console),
        new DailyRotateFile(transportOptions.file),
      ],
      exitOnError: false,
    });

    (this.logger as any).stream = {
      write: (message: string) => {
        this.logger?.info(message.trim());
      },
    };

    return this.logger;
  }

  public static createLogger(config: LoggerConfig) {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance.init();
  }
}

export default Logger;
