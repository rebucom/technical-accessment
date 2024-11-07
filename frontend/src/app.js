import io from 'socket.io-client';
import { generatePayload } from './utils/DataGenerator';

const socket = io('http://localhost:3000');

function sendData() {
  const payload = generatePayload();
  socket.emit('data', payload);
}

setInterval(sendData, 5 * 60 * 1000); // Send data every 5 minutes