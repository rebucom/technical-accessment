const mysql = require('mysql2');

const dbConfig = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppassword',
    database: process.env.DB_NAME || 'message_queue',
    waitForConnections: true,
    connectionLimit: 10,
});

dbConfig.getConnection((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    } else {
        console.log('Connected to MySQL database.');
    }
});

module.exports = dbConfig.promise();
