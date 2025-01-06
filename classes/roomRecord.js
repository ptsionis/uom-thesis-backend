const Categories = require("../enums/categoriesEnum");
const Levels = require("../enums/levelsEnum");
const { increaseCategoryStats } = require("../util/roomUtils");

class RoomRecord {
  constructor(roomId, challenger, target) {
    this.roomId = roomId;
    this.challenger = challenger;
    this.target = target;
    this.turn = this.challenger.id;
    this.lockAnswers = false;
    this.currentQuestion = null;
    this.questionsPlayed = [];
    this.totalQuestionsCount = 0;
  }

  getPlayerById(id) {
    if (id === this.challenger.id) {
      return this.challenger;
    }
    return this.target;
  }

  getTotalQuestionsCount() {
    return Object.keys(Categories).length * Object.keys(Levels).length;
  }

  hasParticipant(id) {
    if (id === this.challenger.id || id === this.target.id) {
      return true;
    }
    return false;
  }

  isNextRoundAvailable() {
    return this.questionsPlayed.length < this.getTotalQuestionsCount();
  }

  isQuestionPlayed(category, level) {
    const questionTag = Categories[category] + level;
    return this.questionsPlayed.includes(questionTag);
  }

  addQuestionPlayed(question) {
    this.currentQuestion = question;
    const questionTag = question.category + question.level;
    this.questionsPlayed.push(questionTag);
  }

  getQuestionTrimmed() {
    const trimmedQuestion = { ...this.currentQuestion };
    delete trimmedQuestion.id;
    delete trimmedQuestion.correctId;
    delete trimmedQuestion.createdAt;
    delete trimmedQuestion.updatedAt;
    return trimmedQuestion;
  }

  getCorrectAnswerId() {
    return this.currentQuestion.correctId;
  }

  toggleAnswersLock() {
    this.lockAnswers = !this.lockAnswers;
  }

  toggleTurn() {
    if (this.turn === this.challenger.id) {
      this.turn = this.target.id;
      return;
    }
    this.turn = this.challenger.id;
  }

  increasePlayerPoints(id, answerId) {
    if (answerId === this.currentQuestion.correctId) {
      const player = this.getPlayerById(id);
      player.points += this.currentQuestion.level;
    }
  }

  updatePlayerStats(id, answerId) {
    const questionCategory = this.currentQuestion.category;
    const player = this.getPlayerById(id);
    const isCorrect = this.currentQuestion.correctId === answerId;
    increaseCategoryStats(player, questionCategory, isCorrect);
  }
}

module.exports = RoomRecord;
