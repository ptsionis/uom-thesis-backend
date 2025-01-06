const Roles = require("../enums/rolesEnum");

const isAdmin = (socket) => {
  return socket.request.user.role === Roles.ADMIN;
};

const isModerator = (socket) => {
  return socket.request.user.role === Roles.MODERATOR;
};

const isUser = (socket) => {
  return socket.request.user.role === Roles.USER;
};

module.exports = { isAdmin, isModerator, isUser };
