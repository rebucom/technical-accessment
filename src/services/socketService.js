import { addMessage } from './messageService.js';

const validateMessage = (data) => {
  const requiredFields = ['userId', 'content'];
  return requiredFields.every((field) => data && data[field]);
};

const createSocketHandler = (socket) => {
  const handleMessage = async (data) => {
    try {
      if (!validateMessage(data)) {
        throw new Error('Invalid message format');
      }

      await addMessage({
        userId: data.userId,
        content: data.content,
        socketId: socket.id,
        timestamp: new Date(),
      });

      socket.emit('messageReceived', {
        status: 'queued',
        timestamp: new Date(),
        messageId: data.messageId,
      });
    } catch (error) {
      createLogger.error('Error handling message:', error);
      socket.emit('error', {
        message: error.message,
        timestamp: new Date(),
      });
    }
  };

  const handleDisconnect = () => {
    createLogger.info(`Client disconnected: ${socket.id}`);
  };

  return {
    handleMessage,
    handleDisconnect,
  };
};

export const handleConnection = (socket) => {
  createLogger.info(`Client connected: ${socket.id}`);

  const socketHandler = createSocketHandler(socket);

  socket.on('message', socketHandler.handleMessage);
  socket.on('disconnect', socketHandler.handleDisconnect);
};
