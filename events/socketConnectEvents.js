const {
  notifyStatus,
  modifySocketAvailability,
} = require("../util/socketUtils");
const Availabilities = require("../enums/availabilitesEnum");
const ChallengeManager = require("../managers/challengeManager");
const RoomManager = require("../managers/roomManager");

const socketConnectEvents = (io, onlineIdsToSockets) => {
  io.on("connection", async (socket) => {
    const userRooms = await io
      .in(`user:${socket.request.user.id}`)
      .fetchSockets();
    const isUserConnected = userRooms.length > 0;
    if (isUserConnected) {
      io.to(socket.id).emit("already_connected");
      socket.disconnect();
      return;
    }
    socket.join(`user:${socket.request.user.id}`);
    socket.availability = Availabilities.ONLINE;
    socket.roomId = "";
    socket.challengeId = "";
    socket.amIChallenger = false;
    onlineIdsToSockets.set(socket.request.user.id, socket.id);

    socket.on("available", () => {
      modifySocketAvailability(
        io,
        socket.request.user.id,
        Availabilities.ONLINE,
        onlineIdsToSockets,
      );
    });

    socket.on("not_available", () => {
      modifySocketAvailability(
        io,
        socket.request.user.id,
        Availabilities.OFFLINE,
        onlineIdsToSockets,
      );
      ChallengeManager.releaseChallengers(
        io,
        socket.request.user.id,
        socket.challengeId,
        onlineIdsToSockets,
      );
    });

    socket.on("disconnect", () => {
      notifyStatus(io, socket.request.user.id, Availabilities.OFFLINE);
      if (socket.challengeId)
        ChallengeManager.releaseChallengers(
          io,
          socket.request.user.id,
          socket.challengeId,
          onlineIdsToSockets,
        );
      if (socket.roomId)
        RoomManager.releaseOpponents(
          io,
          socket.request.user.id,
          socket.roomId,
          onlineIdsToSockets,
        );
      onlineIdsToSockets.delete(socket.request.user.id);
    });
  });
};

module.exports = socketConnectEvents;
