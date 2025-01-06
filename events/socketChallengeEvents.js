const ChallengeManager = require("../managers/challengeManager");

const socketChallengeEvents = (io, onlineIdsToSockets) => {
  io.on("connection", (socket) => {
    socket.on("challenge", (targetId) => {
      ChallengeManager.createChallenge(
        io,
        socket,
        targetId,
        onlineIdsToSockets,
      );
    });

    socket.on("challenge_open", () => {
      ChallengeManager.enterOpenChallenge(io, socket, onlineIdsToSockets);
    });

    socket.on("challenge_cancel", (targetId) => {
      ChallengeManager.cancelChallenge(
        io,
        socket,
        targetId,
        onlineIdsToSockets,
      );
    });

    socket.on("open_challenge_cancel", () => {
      ChallengeManager.cancelOpenChallenge(io, socket, onlineIdsToSockets);
    });

    socket.on("challenge_decline", (challengerId) => {
      ChallengeManager.declineChallenge(
        io,
        socket,
        challengerId,
        onlineIdsToSockets,
      );
    });

    socket.on("challenge_accept", (challengerId) => {
      ChallengeManager.acceptChallenge(
        io,
        socket,
        challengerId,
        onlineIdsToSockets,
      );
    });
  });
};

module.exports = socketChallengeEvents;
