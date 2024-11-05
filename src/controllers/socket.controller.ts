import { Socket } from 'socket.io';
import dataQueue, { QueueData } from '../services/messageQueue';


export default (socket: Socket) => {
  socket.on('data', (data: QueueData) => {
   
    dataQueue.add([{ user_id: data.user_id, message: data.message, timestamp: data.timestamp, msg_id: data.msg_id }
    ]);
  });
};
