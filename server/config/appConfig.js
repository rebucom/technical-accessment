
/**
 * Config to describe the application behavior
 * Batch Size - The total number of items to be processed per batch
 * Batch Interval - The interval between each batch process. This should help give time for enough request
 * so we can process them at once
 */

module.exports = {
    PORT: process.env.PORT || 3000,
    BATCH_SIZE: process.env.BATCH_SIZE || 50, // Controls batch size for writes
    BATCH_INTERVAL: process.env.BATCH_INTERVAL || 60000, // Time interval for batching (1 minute by defat)
};
