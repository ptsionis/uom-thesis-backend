const { getFriends } = require("../controllers/friendsController");
const { getFriendsStatus } = require("../util/socketUtils");

const socketFriendsEvents = (io, onlineIdsToSockets) => {
  io.on("connection", (socket) => {
    socket.on("get_friends", async () => {
      const friends = await getFriends(socket.request.user.id);
      io.to(`user:${socket.request.user.id}`).emit("set_friends", friends);
    });

    socket.on("get_friends_status", () => {
      getFriendsStatus(io, socket, onlineIdsToSockets);
    });
  });
};

module.exports = socketFriendsEvents;
