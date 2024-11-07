const { BATCH_SIZE, BATCH_INTERVAL } = require('../config/appConfig');
const messageModel = require('../models/messageModel');

/**
 * The queue service handles the que operation
 * 
 * For the sake of demonstration, an array was used as the queue
 * 
 * However, since the Queue service is an isolated class in this file, a more robust implementation
 * can be done by using a service like Redis as the queue. The only thing that changes is just the implementation
 * of the exact same functions defined in the class below.
 */

class QueueService {
    constructor() {
        this.queue = [];
        // on creation of an instance of the class, we want the proccess to start running
        this.startBatchProcessing();
    }

    addToQueue(message) {
        this.queue.push(message);
    }

    async startBatchProcessing() {
        setInterval(async () => {
            if (this.queue.length > 0) {
                const batch = this.queue.splice(0, BATCH_SIZE);
                try {
                    await messageModel.insertMessages(batch);
                    console.log(`Batch of ${batch.length} messages written to database.`);
                } catch (error) {
                    console.error('Error writing batch to database:', error);
                    this.queue.unshift(...batch); // Requeue messages on failure
                }
            }
        }, BATCH_INTERVAL);
    }
}

module.exports = new QueueService();
