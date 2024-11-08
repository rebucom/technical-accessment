import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import faker from 'faker';

const socket = io('http://localhost:4000');

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const generateRandomData = () => {
      const randomData = {
        userId: faker.random.uuid(),
        content: faker.lorem.sentence(),
        timestamp: new Date(),
      };
      return randomData;
    };

    const intervalId = setInterval(() => {
      const randomData = generateRandomData();
      socket.emit('message', randomData);
      setData(randomData);

      console.log({ data });
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Frontend App</h1>
      <p> Sending random data to backend every 5 minutes...</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
