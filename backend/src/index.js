require('dotenv').config({ path: 'variables.env' });
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();
server.express.use(cookieParser());
server.express.use((req, _res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});
server.express.use(async (req, _res, next) => {
  if (!req.userId) return next();
  req.user = await db.query.user({ where: { id: req.userId } }, '{ id, email, name, permissions }');
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
