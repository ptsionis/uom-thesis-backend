const { getUser } = require("../controllers/userController");

const socketUserEvents = (io) => {
  io.on("connection", (socket) => {
    socket.on("user_init", async () => {
      const user = await getUser(socket.request.user.id);
      if (user) {
        io.to(`user:${socket.request.user.id}`).emit("user_init_success", user);
      } else {
        io.to(`user:${socket.request.user.id}`).emit("user_init_fail");
      }
    });
  });
};

module.exports = socketUserEvents;
