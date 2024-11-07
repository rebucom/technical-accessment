const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./config/database');
const socketService = require('./services/SocketService');
const { processQueue } = require('./services/QueueService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

socketService(io);

// Process queue every minute
setInterval(processQueue, 60000);

module.exports = { app, server };
