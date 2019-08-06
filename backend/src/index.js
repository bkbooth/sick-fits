require('dotenv').config({ path: 'variables.env' });

const server = require('./createServer')();
server.express.use(require('cookie-parser')());

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
