const queueService = require('../services/queueService');

/**
 * A simpe function to handle incoming messages
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const handleIncomingMessage = (req, res) => {
  try {
    const { user_id, message } = req.body;
    if (!user_id || !message) {
      return res.status(400).json({ error: 'User ID and message are required' });
    }

    queueService.addToQueue({ user_id, message });
    return res.status(200).json({ status: 'Message received and queued' });
  } catch (error) {
    console.error('Error handling incoming message:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { handleIncomingMessage };
