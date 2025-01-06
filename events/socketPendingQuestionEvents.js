const {
  submitPendingQuestion,
  getAllPendingQuestions,
  deletePendingQuestion,
  acceptPendingQuestion,
} = require("../controllers/pendingQuestionController");
const { isUser } = require("../middleware/rolesMiddleware");

const socketPendingQuestionEvents = (io) => {
  io.on("connection", (socket) => {
    socket.on("get_all_pending_questions", async () => {
      if (isUser(socket)) return;
      const pendingQuestions = await getAllPendingQuestions();
      if (pendingQuestions) {
        io.to(`user:${socket.request.user.id}`).emit(
          "get_all_pending_success",
          pendingQuestions,
        );
      }
    });

    socket.on("submit_pending_question", async (userQuestion) => {
      const submit = await submitPendingQuestion(
        socket.request.user.id,
        userQuestion,
      );
      if (submit) {
        io.to(`user:${socket.request.user.id}`).emit("submit_pending_success");
      } else {
        io.to(`user:${socket.request.user.id}`).emit("submit_pending_fail");
      }
    });

    socket.on("accept_pending_question", async (acceptedQuestion) => {
      if (isUser(socket)) return;
      const isAccepted = await acceptPendingQuestion(acceptedQuestion);
      if (isAccepted) {
        io.to(`user:${socket.request.user.id}`).emit(
          "accept_pending_success",
          acceptedQuestion.id,
        );
      } else {
        io.to(`user:${socket.request.user.id}`).emit("accept_pending_fail");
      }
    });

    socket.on("delete_pending_question", async (pendingQuestionId) => {
      if (isUser(socket)) return;
      const isDeleted = await deletePendingQuestion(pendingQuestionId);
      if (isDeleted) {
        io.to(`user:${socket.request.user.id}`).emit(
          "delete_pending_success",
          pendingQuestionId,
        );
      }
    });
  });
};

module.exports = socketPendingQuestionEvents;
