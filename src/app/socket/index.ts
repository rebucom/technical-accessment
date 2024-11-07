import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { ClientMessage, InventoryPayload } from "../../types";
import { MessageQueue } from "../services/events/MessageQueue";

export class SocketService {
  private io: SocketServer;
  private readonly EVENTS = {
    CONNECTION: "connection",
    CLIENT_DATA: "clientData",
    DISCONNECT: "disconnect",
    ERROR: "error",
  };
  private messageQueue: MessageQueue;

  constructor(server: HttpServer, messageQueue: MessageQueue) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
        methods: ["GET", "POST"],
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });
    this.messageQueue = messageQueue;
    this.initialize();
  }

  public initialize(): void {
    try {
      logger.info("Initializing Socket Service...");

      this.io.on(this.EVENTS.ERROR, (error: Error) => {
        logger.error("Socket server error:", error);
      });

      this.io.on(this.EVENTS.DISCONNECT, this.handleDisconnect.bind(this));

      this.io.on(this.EVENTS.CONNECTION, this.handleConnection.bind(this));

      logger.info("Socket Service initialized successfully");
    } catch (error) {
      logger.error("Failed to initialize Socket Service:", error);
      throw error;
    }
  }

  private handleConnection(socket: Socket): void {
    const clientInfo = {
      id: socket.id,
      ip: socket.handshake.address,
      userAgent: socket.handshake.headers["user-agent"],
    };

    this.setupEventHandlers(socket);

    socket.emit("welcome", {
      message: "Connected to server",
      timestamp: Date.now(),
    });
  }

  private setupEventHandlers(socket: Socket): void {
    socket.on(this.EVENTS.CLIENT_DATA, (data: InventoryPayload) => {
      this.handleClientData(socket, data);
    });
  }

  private handleClientData(socket: Socket, data: InventoryPayload): void {
    try {
      const enrichedMessage = {
        ...data,
        clientId: socket.id,
        timestamp: Date.now(),
        metadata: {
          ip: socket.handshake.address,
          userAgent: socket.handshake.headers["user-agent"],
        },
      };

      this.messageQueue.enqueue(enrichedMessage);

      socket.emit("messageReceived", {
        status: "success",
        messageId: enrichedMessage.timestamp,
        timestamp: Date.now(),
      });

      logger.debug("Message queued successfully:", {
        clientId: socket.id,
        messageTimestamp: enrichedMessage.timestamp,
      });
    } catch (error: any) {
      this.handleError(socket, error);
    }
  }

  private handleDisconnect(socket: Socket): void {
    logger.info("Client disconnected:", {
      clientId: socket.id,
      reason: socket.disconnected,
    });
  }

  private handleError(socket: Socket, error: Error): void {
    logger.error("Socket error:", {
      clientId: socket.id,
      error: error.message,
      stack: error.stack,
    });

    socket.emit("error", {
      message: "Error processing request",
      timestamp: Date.now(),
    });
  }

  public getConnectedClients(): number {
    return this.io.engine.clientsCount;
  }

}
