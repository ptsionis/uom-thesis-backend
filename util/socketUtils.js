const { getFriends } = require("../controllers/friendsController");
const Availabilities = require("../enums/availabilitesEnum");

exports.getFriendsStatus = async (io, socket, onlineIdsToSockets) => {
  const friends = await getFriends(socket.request.user.id);
  if (!friends) {
    return;
  }
  for (const friend of friends) {
    const friendId = friend.id;
    const status = this.getSocketAvailability(io, friendId, onlineIdsToSockets);
    const didFriendChallengeMe = this.didFriendChallengeMe(
      io,
      socket,
      friendId,
      onlineIdsToSockets,
    );
    const amIChallenger = this.amIChallenger(
      io,
      socket,
      friendId,
      onlineIdsToSockets,
    );
    io.to(`user:${socket.request.user.id}`).emit("friend_status", {
      userId: friendId,
      status: status,
      challengedMe: didFriendChallengeMe,
      amIChallenger: amIChallenger,
    });
  }
};

exports.notifyStatus = async (io, userId, status) => {
  const friends = await getFriends(userId);
  if (!friends) {
    return;
  }
  for (const friend of friends) {
    const friendId = friend.id;
    io.to(`user:${friendId}`).emit("friend_status", {
      userId: userId,
      status: status,
      challengedMe: false,
      amIChallenger: false,
    });
  }
};

exports.getSocketAvailability = (io, userId, onlineIdsToSockets) => {
  const socketId = onlineIdsToSockets.get(userId);
  if (socketId) {
    return io.sockets.sockets.get(socketId).availability;
  } else {
    return Availabilities.OFFLINE;
  }
};

exports.didFriendChallengeMe = (io, socket, userId, onlineIdsToSockets) => {
  const socketId = onlineIdsToSockets.get(userId);
  if (socketId && socket.challengeId) {
    return io.sockets.sockets.get(socketId).challengeId === socket.challengeId;
  } else {
    return false;
  }
};

exports.amIChallenger = (io, socket, userId, onlineIdsToSockets) => {
  const socketId = onlineIdsToSockets.get(userId);
  if (socketId && socket.challengeId) {
    return (
      io.sockets.sockets.get(socketId).challengeId === socket.challengeId &&
      socket.amIChallenger
    );
  } else {
    return false;
  }
};

exports.modifySocketAvailability = (
  io,
  userId,
  availability,
  onlineIdsToSockets,
) => {
  const socketId = onlineIdsToSockets.get(userId);
  io.sockets.sockets.get(socketId).availability = availability;
  this.notifyStatus(io, userId, availability);
};

exports.updateSocketChallengeId = (
  io,
  userId,
  challengeId,
  onlineIdsToSockets,
) => {
  const socketId = onlineIdsToSockets.get(userId);
  io.sockets.sockets.get(socketId).challengeId = challengeId;
};

exports.updateSocketRoomId = (io, userId, roomId, onlineIdsToSockets) => {
  const socketId = onlineIdsToSockets.get(userId);
  io.sockets.sockets.get(socketId).roomId = roomId;
};
