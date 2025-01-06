const {
  getSocketAvailability,
  modifySocketAvailability,
  updateSocketChallengeId,
  updateSocketRoomId,
} = require("../util/socketUtils");
const Availabilities = require("../enums/availabilitesEnum");
const { getUserForGame } = require("../controllers/userController");
const RoomManager = require("./roomManager");
const ChallengeRecord = require("../classes/challengeRecord");
const { generateRoomId } = require("../util/roomUtils");

const challengeErrorMsg =
  "There is already an other open request by you or invited person.";

class ChallengeManager {
  static activeChallenges = new Map();
  static activeOpenChallenges = new Array();

  static async createChallenge(io, socket, targetId, onlineIdsToSockets) {
    const challengerId = socket.request.user.id;
    if (
      getSocketAvailability(io, challengerId, onlineIdsToSockets) ===
        Availabilities.ONLINE &&
      getSocketAvailability(io, targetId, onlineIdsToSockets) ===
        Availabilities.ONLINE
    ) {
      modifySocketAvailability(
        io,
        challengerId,
        Availabilities.PENDING,
        onlineIdsToSockets,
      );
      modifySocketAvailability(
        io,
        targetId,
        Availabilities.PENDING,
        onlineIdsToSockets,
      );
      const challengeId = generateRoomId(this.activeChallenges);
      const challenge = new ChallengeRecord(
        challengeId,
        challengerId,
        targetId,
        false,
      );
      socket.amIChallenger = true;
      updateSocketChallengeId(
        io,
        challengerId,
        challengeId,
        onlineIdsToSockets,
      );
      updateSocketChallengeId(io, targetId, challengeId, onlineIdsToSockets);
      this.activeChallenges.set(challengeId, challenge);
      io.to(`user:${challengerId}`).emit("challenge_sent", targetId);
      io.to(`user:${targetId}`).emit("challenge_notification", challengerId);
      const challengerProfile = await getUserForGame(challengerId);
      io.to(`user:${targetId}`).emit(
        "challenge_notification_detailed",
        challengerProfile,
      );
    } else {
      io.to(`user:${challengerId}`).emit("challenge_error", challengeErrorMsg);
    }
  }

  static async enterOpenChallenge(io, socket, onlineIdsToSockets) {
    if (this.activeOpenChallenges.length > 0) {
      const challenge = this.activeOpenChallenges.pop();
      challenge.targetId = socket.request.user.id;
      this.acceptChallenge(
        io,
        socket,
        challenge.challengerId,
        onlineIdsToSockets,
      );
    } else {
      const challengerId = socket.request.user.id;
      if (
        getSocketAvailability(io, challengerId, onlineIdsToSockets) ===
        Availabilities.ONLINE
      ) {
        modifySocketAvailability(
          io,
          challengerId,
          Availabilities.PENDING,
          onlineIdsToSockets,
        );
        const challengeId = generateRoomId(this.activeChallenges);
        const challenge = new ChallengeRecord(
          challengeId,
          challengerId,
          "",
          true,
        );
        socket.amIChallenger = true;
        updateSocketChallengeId(
          io,
          challengerId,
          challengeId,
          onlineIdsToSockets,
        );
        this.activeOpenChallenges.push(challenge);
        io.to(`user:${challengerId}`).emit("open_challenge_created");
      } else {
        io.to(`user:${challengerId}`).emit(
          "challenge_error",
          challengeErrorMsg,
        );
      }
    }
  }

  static cancelChallenge(io, socket, targetId, onlineIdsToSockets) {
    const challengerId = socket.request.user.id;
    const challengeId = socket.challengeId;
    if (this.activeChallenges.has(challengeId) && socket.amIChallenger) {
      this.activeChallenges.delete(challengeId);
      modifySocketAvailability(
        io,
        challengerId,
        Availabilities.ONLINE,
        onlineIdsToSockets,
      );
      modifySocketAvailability(
        io,
        targetId,
        Availabilities.ONLINE,
        onlineIdsToSockets,
      );
      socket.amIChallenger = false;
      updateSocketChallengeId(io, challengerId, "", onlineIdsToSockets);
      updateSocketChallengeId(io, targetId, "", onlineIdsToSockets);
      io.to(`user:${challengerId}`).emit("challenge_cancelled_ch", targetId);
      io.to(`user:${targetId}`).emit("challenge_cancelled_ta", challengerId);
    }
  }

  static cancelOpenChallenge(io, socket, onlineIdsToSockets) {
    const challengerId = socket.request.user.id;
    const challengeId = socket.challengeId;
    const openChallengeToDestroyIndex = this.activeOpenChallenges.findIndex(
      (chall) => chall.challengeId === challengeId,
    );
    if (openChallengeToDestroyIndex !== -1 && socket.amIChallenger) {
      this.activeOpenChallenges.splice(openChallengeToDestroyIndex, 1);
      modifySocketAvailability(
        io,
        challengerId,
        Availabilities.ONLINE,
        onlineIdsToSockets,
      );
      socket.amIChallenger = false;
      updateSocketChallengeId(io, challengerId, "", onlineIdsToSockets);
      io.to(`user:${challengerId}`).emit("open_challenge_cancelled");
    }
  }

  static declineChallenge(io, socket, challengerId, onlineIdsToSockets) {
    const targetId = socket.request.user.id;
    const challengeId = socket.challengeId;
    const challengerSocketId = onlineIdsToSockets.get(challengerId);
    if (this.activeChallenges.has(challengeId)) {
      this.activeChallenges.delete(challengeId);
      modifySocketAvailability(
        io,
        challengerId,
        Availabilities.ONLINE,
        onlineIdsToSockets,
      );
      modifySocketAvailability(
        io,
        targetId,
        Availabilities.ONLINE,
        onlineIdsToSockets,
      );
      io.sockets.sockets.get(challengerSocketId).amIChallenger = false;
      updateSocketChallengeId(io, challengerId, "", onlineIdsToSockets);
      updateSocketChallengeId(io, targetId, "", onlineIdsToSockets);
      io.to(`user:${challengerId}`).emit("challenge_rejected", targetId);
      io.to(`user:${targetId}`).emit("rejected_successfully", challengerId);
    }
  }

  static async acceptChallenge(io, socket, challengerId, onlineIdsToSockets) {
    const challengeId = socket.challengeId;
    const targetId = socket.request.user.id;
    const challengerProfile = await getUserForGame(challengerId);
    const targetProfile = await getUserForGame(targetId);
    const newRoomId = RoomManager.createRoom(
      challengerId,
      challengerProfile,
      targetId,
      targetProfile,
    );
    if (newRoomId) {
      const challengerSocketId = onlineIdsToSockets.get(challengerId);
      const targetSocketId = onlineIdsToSockets.get(targetId);
      io.sockets.sockets.get(challengerSocketId).join(newRoomId);
      io.sockets.sockets.get(targetSocketId).join(newRoomId);
      modifySocketAvailability(
        io,
        challengerId,
        Availabilities.PLAYING,
        onlineIdsToSockets,
      );
      modifySocketAvailability(
        io,
        targetId,
        Availabilities.PLAYING,
        onlineIdsToSockets,
      );
      io.sockets.sockets.get(challengerSocketId).amIChallenger = false;
      this.activeChallenges.delete(challengeId);
      updateSocketRoomId(io, challengerId, newRoomId, onlineIdsToSockets);
      updateSocketRoomId(io, targetId, newRoomId, onlineIdsToSockets);
      io.to(`user:${challengerId}`).emit("start_game", newRoomId);
      io.to(`user:${targetId}`).emit("start_game", newRoomId);
    }
  }

  static releaseChallengers(io, quitterId, challengeId, onlineIdsToSockets) {
    const challengeToDestroy = this.activeChallenges.get(challengeId);
    if (challengeToDestroy) {
      if (challengeToDestroy.challengerId !== quitterId) {
        const challengerSocketId = onlineIdsToSockets.get(
          challengeToDestroy.challengerId,
        );
        modifySocketAvailability(
          io,
          challengeToDestroy.challengerId,
          Availabilities.ONLINE,
          onlineIdsToSockets,
        );
        io.sockets.sockets.get(challengerSocketId).amIChallenger = false;
        updateSocketChallengeId(
          io,
          challengeToDestroy.challengerId,
          "",
          onlineIdsToSockets,
        );
      } else {
        modifySocketAvailability(
          io,
          challengeToDestroy.targetId,
          Availabilities.ONLINE,
          onlineIdsToSockets,
        );
        updateSocketChallengeId(
          io,
          challengeToDestroy.targetId,
          "",
          onlineIdsToSockets,
        );
        io.to(`user:${challengeToDestroy.targetId}`).emit("challenger_left");
      }
      this.activeChallenges.delete(challengeId);
    } else {
      const openChallengeToDestroyIndex = this.activeOpenChallenges.findIndex(
        (chall) => chall.challengeId === challengeId,
      );
      if (openChallengeToDestroyIndex !== -1) {
        this.activeOpenChallenges.splice(openChallengeToDestroyIndex, 1);
      }
    }
  }
}

module.exports = ChallengeManager;
