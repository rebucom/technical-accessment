const { addToQueue } = require('../services/QueueService');

module.exports = {
  handleIncomingData: (data) => {
    addToQueue(data);
  },
};