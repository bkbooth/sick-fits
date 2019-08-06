require('dotenv').config({ path: 'variables.env' });
const jwt = require('jsonwebtoken');

const server = require('./createServer')();
server.express.use(require('cookie-parser')());
server.express.use((req, _res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  ({ port }) => console.log(`Server started, listening at http://localhost:${port}`)
);
