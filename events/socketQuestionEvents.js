const {
  getAllQuestions,
  deleteQuestion,
  updateQuestion,
} = require("../controllers/questionController");
const { isUser } = require("../middleware/rolesMiddleware");

const socketQuestionEvents = (io) => {
  io.on("connection", (socket) => {
    socket.on("get_all_questions", async () => {
      if (isUser(socket)) return;
      const questions = await getAllQuestions();
      if (questions) {
        io.to(`user:${socket.request.user.id}`).emit(
          "get_all_questions_success",
          questions,
        );
      }
    });

    socket.on("update_question", async (questionId, question) => {
      if (isUser(socket)) return;
      const isUpdated = await updateQuestion(questionId, question);
      if (isUpdated) {
        io.to(`user:${socket.request.user.id}`).emit(
          "update_question_success",
          questionId,
        );
      }
    });

    socket.on("delete_question", async (questionId) => {
      if (isUser(socket)) return;
      const isDeleted = await deleteQuestion(questionId);
      if (isDeleted) {
        io.to(`user:${socket.request.user.id}`).emit(
          "delete_question_success",
          questionId,
        );
      }
    });
  });
};

module.exports = socketQuestionEvents;
