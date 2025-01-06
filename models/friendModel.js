const { DataTypes } = require("sequelize");

const sequelize = require("../util/db");

const Friend = sequelize.define("friend", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  friendA: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  friendB: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Friend;
