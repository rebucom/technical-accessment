# Socket Data Processing Service

@DesmondSanctity @iamwhitegod Here is my submission for the backend test.

## Overview
This project implements a backend service that efficiently handles incoming data from multiple users via socket connections. To improve performance and reduce database write operations, a message queue is used to batch process incoming JSON data before writing to a MySQL database.

## Features
- Socket server to receive data from client applications.
- Message queue to manage and batch incoming data.
- MySQL database integration for data storage.
- Clean and modular code structure for maintainability.

## Technologies Used
- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for creating the server and handling routes.
- **Socket.io**: Library for real-time communication between the client and server.
- **MySQL**: Relational database for data storage.
- **Redis (optional)**: Can be used as a message queue to handle the incoming data efficiently.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- (Optional) Redis Server for message queuing

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Olatisunkanmi/technical-accessment.git

2. Install Requires deps:
   ```bash
   npm install

3. Setup up your Env:
   ```bash
   DB_URL=mysql://user:password@localhost:3306
   DATABASE=your_database_name
   PORT=3333
   BATCH_SIZE=100 
   BATCH_INTERVAL=5000

4. Start the Server:
   ```bash
   npm run start

## Service Lifecycle Logging

Throughout the service lifecycle, every activity is logged. Below is a summary of the log flow:

- **Application Start**: Logs when the application starts.
 bash
 ```  
   2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Initializing Database Pool
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Database pool connected successfully
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Setting Up Database
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Running createDB query...
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Running createInventory query...
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Database setup completed successfully
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Database Setup is Complete
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Messaging Queue is started
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Broker Service is Started
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Inventory Consumer is subscribed to Event Broker
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Initializing Socket Service...
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Socket Service initialized successfully
2024-11-07 10:23:26 [info] [Messaging Queuing Service]: Server is running at http://localhost:3333
 ```
- **Event Broker Ready**: Logs when the event broker is ready to send a batch to the inventory consumer.
bash
```
2024-11-07 10:46:54 [info] [Messaging Queuing Service]: Event Broker received batch of 5 messages
```
- **Inventory Consumer Processing**: Logs each item being processed by the inventory consumer.
 bash
```
2024-11-07 10:23:54 [info] [Messaging Queuing Service]: Processing Inventory Data of: f0c8cece-ca3f-4b38-ad9d-c38cf9cdbe6e
2024-11-07 10:23:54 [info] [Messaging Queuing Service]: Message da327992-200f-48d3-b253-da8147a12ada saved successfully.
2024-11-07 10:23:54 [info] [Messaging Queuing Service]: Message 240d5321-36de-4eb3-973e-63a74dab0816 saved successfully.
```
- **Inventory Consumer Processing: Error Handling**
bash
```
2024-11-07 10:46:54 [error] [Messaging Queuing Service]: Incorrect integer value: 'productId' for column 'product_id' at row 1
2024-11-07 10:46:54 [error] [Messaging Queuing Service]: Incorrect integer value: 'productId' for column 'product_id' at row 1
2024-11-07 10:46:54 [error] [Messaging Queuing Service]: Incorrect integer value: 'productId' for column 'product_id' at row 1
2024-11-07 10:46:54 [error] [Messaging Queuing Service]: Incorrect integer value: 'productId' for column 'product_id' at row 1
```

This structured logging ensures clear visibility of key events and operations throughout the service lifecycle.




