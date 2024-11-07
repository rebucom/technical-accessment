const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const db = require('./config/dbConfig');
const { createMessageTable } = require('./models/messageModel');
const messageController = require('./controllers/messageController');

const app = express();
const server = http.createServer(app);
app.use(cors());
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middlewares
app.use(express.json());
// to handle via restful
// app.post('/api/messages', messageController.handleIncomingMessage);

// Socket connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('sendMessage', (data) => {
        messageController.handleIncomingMessage(data, { json: () => { } });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Initialize database table
createMessageTable();

module.exports = { app, server };
