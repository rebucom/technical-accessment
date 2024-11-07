const queueService = require('../services/queueService');

const handleIncomingMessage = (data) => {
    console.log(data)
    try {
        const { user_id, message } = data;

        if (!user_id || !message) {
            throw new Error('User ID and message are required');
        }

        // Add the incoming message to the queue
        queueService.addToQueue({ user_id, message });
        console.log('Message received and queued');
    } catch (error) {
        console.error('Error handling incoming message:', error);
    }
};

module.exports = { handleIncomingMessage };
