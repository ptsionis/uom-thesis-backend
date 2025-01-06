const { DataTypes } = require("sequelize");

const sequelize = require("../util/db");

const PendingQuestion = sequelize.define("pendingQuestions", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  answer1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer3: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer4: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correctId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = PendingQuestion;
