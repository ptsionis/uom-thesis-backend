const {
  getOpponentId,
  delay,
  isQuestionRequestValid,
  generateRoomId,
} = require("../util/roomUtils");
const {
  modifySocketAvailability,
  updateSocketRoomId,
} = require("../util/socketUtils");
const Availabilities = require("../enums/availabilitesEnum");
const {
  punishUser,
  updateUserAfterGame,
} = require("../controllers/userController");
const { getQuestion } = require("../controllers/questionController");
const Scores = require("../enums/scoresEnum");
const Player = require("../classes/player");
const RoomRecord = require("../classes/roomRecord");

class RoomManager {
  static activeRooms = new Map();

  static createRoom(challengerId, challengerProfile, targetId, targetProfile) {
    const roomId = generateRoomId(this.activeRooms);
    const challenger = new Player(challengerId, challengerProfile);
    const target = new Player(targetId, targetProfile);
    if (challenger && target) {
      const room = new RoomRecord(roomId, challenger, target);
      this.activeRooms.set(roomId, room);
      return roomId;
    }
    return null;
  }

  static gameInitInfo(io, socket, roomId) {
    const playerId = socket.request.user.id;
    const room = this.activeRooms.get(roomId);
    if (
      room &&
      (playerId === room.challenger.id || playerId === room.target.id)
    ) {
      const player = room.getPlayerById(playerId);
      const opponent = room.getPlayerById(getOpponentId(playerId, room));
      io.to(`user:${playerId}`).emit(
        "set_game_init_info",
        player,
        opponent,
        room.turn,
      );
    }
  }

  static async getRoomQuestion(io, socket, roomId, category, level) {
    const room = this.activeRooms.get(roomId);
    const playerId = socket.request.user.id;
    if (
      !room ||
      !room.hasParticipant(playerId) ||
      !isQuestionRequestValid(category, level) ||
      room.isQuestionPlayed(category, level)
    ) {
      return null;
    }
    const question = await getQuestion(category, level);
    if (question) {
      room.addQuestionPlayed(question);
      io.to(roomId).emit("set_question", room.getQuestionTrimmed(), room.turn);
    }
  }

  static async submitAndRevealAnswer(
    io,
    socket,
    roomId,
    answerId,
    onlineIdsToSockets,
  ) {
    const room = this.activeRooms.get(roomId);
    const playerId = socket.request.user.id;
    if (
      ![1, 2, 3, 4].includes(answerId) ||
      !room.hasParticipant(playerId) ||
      room.lockAnswers ||
      room.turn !== playerId
    ) {
      return null;
    }
    room.toggleAnswersLock();
    io.to(roomId).emit("selected_answer", answerId);
    await delay(3000);
    io.to(roomId).emit("reveal_answer", answerId, room.getCorrectAnswerId());
    room.increasePlayerPoints(playerId, answerId);
    room.updatePlayerStats(playerId, answerId);
    io.to(`user:${playerId}`).emit(
      "update_players",
      room.getPlayerById(playerId),
      room.getPlayerById(getOpponentId(playerId, room)),
    );
    io.to(`user:${getOpponentId(playerId, room)}`).emit(
      "update_players",
      room.getPlayerById(getOpponentId(playerId, room)),
      room.getPlayerById(playerId),
    );
    await delay(3000);
    if (room.isNextRoundAvailable()) {
      room.toggleAnswersLock();
      room.toggleTurn();
      io.to(roomId).emit("start_next_round", room.questionsPlayed, room.turn);
    } else {
      this.endGame(io, room, onlineIdsToSockets);
    }
  }

  static endGame(io, room, onlineIdsToSockets) {
    const challenger = room.challenger;
    const target = room.target;
    if (challenger.points > target.points) {
      challenger.gamesWon++;
      challenger.score += Scores.WIN;
      target.score -= Scores.LOSS;
    } else if (challenger.points < target.points) {
      target.gamesWon++;
      challenger.score -= Scores.LOSS;
      target.score += Scores.WIN;
    }
    challenger.gamesPlayed++;
    target.gamesPlayed++;
    updateUserAfterGame(challenger.id, challenger);
    updateUserAfterGame(target.id, target);
    io.to(room.roomId).emit("game_ended");
    modifySocketAvailability(
      io,
      challenger.id,
      Availabilities.PLAYING,
      onlineIdsToSockets,
    );
    modifySocketAvailability(
      io,
      target.id,
      Availabilities.PLAYING,
      onlineIdsToSockets,
    );
    updateSocketRoomId(io, challenger.id, "", onlineIdsToSockets);
    updateSocketRoomId(io, target.id, "", onlineIdsToSockets);
  }

  static releaseOpponents(io, quitterId, roomId, onlineIdsToSockets) {
    const roomToDestroy = this.activeRooms.get(roomId);
    if (roomToDestroy) {
      const otherPlayerId = getOpponentId(quitterId, roomToDestroy);
      punishUser(quitterId);
      this.activeRooms.delete(roomToDestroy.roomId);
      modifySocketAvailability(
        io,
        otherPlayerId,
        Availabilities.ONLINE,
        onlineIdsToSockets,
      );
      updateSocketRoomId(io, otherPlayerId, "", onlineIdsToSockets);
      io.to(`user:${otherPlayerId}`).emit("opponent_quit", quitterId);
    }
  }
}

module.exports = RoomManager;
