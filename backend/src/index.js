require('dotenv').config({ path: 'variables.env' });

const server = require('./createServer')();

// TODO: use express middleware to handle cookies (JWT)
// TODO: use express middleware to populate current user

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  ({ port }) => console.log(`Server started, listening at http://localhost:${port}`)
);
