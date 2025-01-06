const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_SCHEMA,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
);

(async () => {
  try {
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.log("Unable to connect to the database:", err);
  }
})();

module.exports = sequelize;
