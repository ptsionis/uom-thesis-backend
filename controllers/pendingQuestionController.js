const PendingQuestion = require("../models/pendingQuestionModel");
const Question = require("../models/questionModel");
const Categories = require("../enums/categoriesEnum");

exports.submitPendingQuestion = async (userId, userQuestion) => {
  try {
    const submit = await PendingQuestion.create({
      question: userQuestion.question,
      category: Categories[userQuestion.category],
      level: parseInt(userQuestion.level),
      answer1: userQuestion.answer1,
      answer2: userQuestion.answer2,
      answer3: userQuestion.answer3,
      answer4: userQuestion.answer4,
      correctId: parseInt(userQuestion.correctId),
      source: userQuestion.source,
      userId: userId,
    });
    return submit;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getAllPendingQuestions = async () => {
  try {
    const allPendingQuestions = await PendingQuestion.findAll();
    return allPendingQuestions;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.deletePendingQuestion = async (pendingQuestionId) => {
  try {
    const isDeleted = await PendingQuestion.destroy({
      where: {
        id: pendingQuestionId,
      },
    });
    return isDeleted;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.acceptPendingQuestion = async (acceptedQuestion) => {
  try {
    const isAccepted = await Question.create({
      question: acceptedQuestion.question,
      category: acceptedQuestion.category,
      level: acceptedQuestion.level,
      answer1: acceptedQuestion.answer1,
      answer2: acceptedQuestion.answer2,
      answer3: acceptedQuestion.answer3,
      answer4: acceptedQuestion.answer4,
      correctId: acceptedQuestion.correctId,
    });
    const isPendingDeleted = await PendingQuestion.destroy({
      where: {
        id: acceptedQuestion.id,
      },
    });
    return isAccepted && isPendingDeleted;
  } catch (err) {
    console.log(err);
    return null;
  }
};
