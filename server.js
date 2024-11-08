import { connectDB } from './connectDB.js';
import { Server } from 'socket.io';
import app, { setIO } from './app.js';
import config from './config.js';
import { handleConnection } from './src/services/socketService.js';
import { startMessageProcessing } from './src/services/messageService.js';

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.PORT, () => {
      createLogger.info(`Server running on port ${config.PORT}`);
    });

    const io = new Server(server, {
      cors: {
        origin: config.CORS_ORIGIN || '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      },
    });

    // Initialize socket.io
    setIO(io);
    io.on('connection', handleConnection);

    // Start message processing
    startMessageProcessing();

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      createLogger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        createLogger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    createLogger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// io.on('connection', (socket) => {
//   handleConnection(socket);

//   // Add new event listener for 'ping'
//   socket.on('ping', () => {
//     socket.emit('pong', { timestamp: new Date() });
//   });
// });
