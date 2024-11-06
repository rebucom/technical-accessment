import dataQueue from "../services/messageQueue";
import { processBatch } from "./processBatch";

export async function processQueueBatch() {
    try {
      const jobs = await dataQueue.getJobs(['waiting'], 0, parseInt(process.env.BATCH_SIZE_THRESHOLD||'1000',10) - 10);
 
      if (jobs.length === 0) {
        console.log('No jobs to process.');
        return;
      }
  
      const batchData = jobs.map(job => job?.data);
      
      // Process batch data
   await processBatch(batchData);
  
      console.log(`Processed batch of ${jobs.length} jobs.`);
  
      // remove jobs 
      await Promise.all(jobs.map(job => job.remove()));
  
    } catch (error) {
      console.error('Error processing batch:', error);
    }
  }
  