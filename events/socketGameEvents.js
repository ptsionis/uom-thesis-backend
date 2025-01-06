const RoomManager = require("../managers/roomManager");

const socketGameEvents = (io, onlineIdsToSockets) => {
  io.on("connection", (socket) => {
    socket.on("game_init_info", (roomId) => {
      RoomManager.gameInitInfo(io, socket, roomId);
    });

    socket.on("get_question", (roomId, category, level) => {
      RoomManager.getRoomQuestion(io, socket, roomId, category, level);
    });

    socket.on("submit_answer", (roomId, answerId) => {
      RoomManager.submitAndRevealAnswer(
        io,
        socket,
        roomId,
        answerId,
        onlineIdsToSockets,
      );
    });
  });
};

module.exports = socketGameEvents;
