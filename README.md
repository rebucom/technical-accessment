# backend-test
technical test for backend engineering role at rebucom


### problem statement
your client-side application sends data to the server every 5 minutes through a socket connection. when this message is sent from every thousand users, the app performs poorly because the database is written every time. create a message queue service that handles every socket data sent to the backend to be written to the database.

### expectations
- set up a backend server with node.js and express.js that also has a socket server.
- add a mysql database to the setup. local mysql is fine as far as the solution works with mysql.
- set up a frontend that sends a json payload to the backend every 5 minutes via a socket connection.
- use a queue in the backend to process the json data and write it to the database.

### submission guidelines
- write clean and readable code. use the DRY approach. take initiative on how the codebase for both client and server will look like.
- do not fork this repo; clone and check a new branch with your name as the branch name.
- when you are done, raise a PR against the qa branch and tag me @desmondsanctity.
- you have 5 days to submit the solution.
