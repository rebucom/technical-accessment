const socket = io.connect('http://localhost:3000');
const sendButton = document.getElementById('sendButton');

const sendMessage = () => {
    console.log("Hi hi")
    const data = {
        user_id: `user-${Math.floor(Math.random() * 1000)}`,
        message: `Random message ${Math.random().toString(36).substr(2, 5)}`
    };

    socket.emit('sendMessage', data);
    console.log('Message sent:', data);
};

// Send message every 5 minutes
setInterval(sendMessage, 5 * 60 * 1000);

// Optional button to manually send a message
sendButton.addEventListener('click', sendMessage);
