const Question = require("../models/questionModel");
const Categories = require("../enums/categoriesEnum");
const sequelize = require("../util/db");

exports.getQuestion = async (category, level) => {
  try {
    const question = await Question.findOne({
      where: {
        category: Categories[category],
        level: parseInt(level),
      },
      order: sequelize.random(),
      limit: 1,
    });
    return question;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getAllQuestions = async () => {
  try {
    const allQuestions = await Question.findAll();
    return allQuestions;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.updateQuestion = async (questionId, question) => {
  try {
    const questionToUpdate = await Question.findByPk(questionId);
    questionToUpdate.set({
      question: question.question,
      category: Categories[question.category],
      level: parseInt(question.level),
      answer1: question.answer1,
      answer2: question.answer2,
      answer3: question.answer3,
      answer4: question.answer4,
      correctId: parseInt(question.correctId),
    });
    const isUpdated = await questionToUpdate.save();
    return isUpdated;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.deleteQuestion = async (questionId) => {
  try {
    const isDeleted = await Question.destroy({
      where: {
        id: questionId,
      },
    });
    return isDeleted;
  } catch (err) {
    console.log(err);
    return null;
  }
};
