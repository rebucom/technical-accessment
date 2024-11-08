import { createMessages } from '../factory/messageRepo.js';

const DEFAULT_BATCH_SIZE = 100;
const DEFAULT_PROCESS_INTERVAL = 30000; // 30 seconds

const messageQueue = [];

const addMessage = async (message) => {
  messageQueue.push(message);
  createLogger.debug(
    `Message added to queue. Queue size: ${messageQueue.length}`
  );

  if (messageQueue.length >= DEFAULT_BATCH_SIZE) {
    await processMessages();
  }
};

const processMessages = async () => {
  if (messageQueue.length === 0) return;

  const batch = messageQueue.splice(0, DEFAULT_BATCH_SIZE);

  try {
    await createMessages(batch);
    createLogger.info(`Processed ${batch.length} messages`);
  } catch (error) {
    createLogger.error('Error processing messages:', error);
    messageQueue.unshift(...batch);
  }
};

const startMessageProcessing = () => {
  setInterval(processMessages, DEFAULT_PROCESS_INTERVAL);
  createLogger.info('Message processing started');
};

export { addMessage, startMessageProcessing };
