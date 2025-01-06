const { DataTypes } = require("sequelize");

const sequelize = require("../util/db");

const Question = sequelize.define("questions", {
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
});

module.exports = Question;
