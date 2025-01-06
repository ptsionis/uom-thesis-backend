const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const Roles = require("../enums/rolesEnum");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    facebookId: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(Roles.USER, Roles.MODERATOR, Roles.ADMIN),
      defaultValue: Roles.USER,
    },
    email: {
      type: DataTypes.STRING,
    },
    profilePicUrl: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    gamesPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    gamesWon: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    historyPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    historyWon: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    geographyPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    geographyWon: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    financePlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    financeWon: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    logoPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    logoWon: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    triviaPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    triviaWon: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    hiddenPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    hiddenWon: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ unique: true, fields: ["facebookId"] }],
  },
);

module.exports = User;
