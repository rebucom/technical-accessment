const { app, server } = require('./app');
const { PORT } = require('./config/appConfig');

/**
 * Entry point of the server
 */

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
