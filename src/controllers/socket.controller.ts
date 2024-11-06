import { Socket } from "socket.io";
import dataQueue, { QueueData } from "../services/messageQueue";

export default (socket: Socket) => {
  socket.on("data", async (data: QueueData) => {
    console.log("new data:", { data });
    const add_data: QueueData = {
      user_id: data.user_id,
      message: data.message,
      timestamp: data.timestamp,
      msg_id: data.msg_id,
    };
    const latestQueue = await dataQueue.add(add_data, {
      attempts: 3,
      removeOnComplete: 1000,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
    });
    console.log("added-new");
  });
};
