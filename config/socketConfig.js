const { Server } = require("socket.io");

const socketConfig = (server, corsOptions) => {
  return new Server(server, {
    cors: corsOptions,
  });
};

module.exports = socketConfig;
