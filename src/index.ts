import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import socketController from "./controllers/socket.controller";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socketController(socket);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Message Queue Service is up and running 🎉.");
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
