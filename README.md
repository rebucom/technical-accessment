# CLIENT repo -  https://github.com/codarbind/queuesockets-frontend.git 

# Technical Test for Backend Engineering Role

## Problem Statement

Your client application sends data to the server every 5 minutes through a socket connection. When data is received from thousands of users at once, the app suffers performance issues because each message writes directly to the database. To address this, create a message queue service that manages socket data, batching writes to the database to improve efficiency.

## Expectations

1. **Backend Server**

   - Use **Node.js** with **Express.js** to set up a backend server that includes a socket server.
   - Integrate **MySQL** as the database (local MySQL setup is acceptable as long as it functions with MySQL).
   - Implement a message queue in the backend to process incoming JSON data and batch-write to the database.

2. **Frontend**

   - Build a simple client-side app that sends a JSON payload to the backend every 5 minutes via a socket connection.

3. **Code Quality**
   - Write **clean, readable, and DRY code** for both the frontend and backend.
   - Use a clear structure and modular code organization.

## Submission Guidelines

- **Repository**: Clone this repo, create a new branch with your name, and work on your solution in that branch.
- **Pull Request**: Once complete, raise a PR against the `qa` branch and tag @desmondsanctity.
- **Deadline**: You have **3 days** to complete and submit your solution.

If you have any questions, please feel free to reach out. We look forward to seeing your approach!
