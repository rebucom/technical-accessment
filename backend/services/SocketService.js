const { addToQueue } = require('./QueueService');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('data', (data) => {
      addToQueue(data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};