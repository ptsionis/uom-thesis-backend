const Categories = require("../enums/categoriesEnum");
const Levels = require("../enums/levelsEnum");

exports.getOpponentId = (playerId, room) => {
  if (room.challenger.id === playerId) {
    return room.target.id;
  }
  return room.challenger.id;
};

exports.delay = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

exports.increaseCategoryStats = (player, category, isCorrect) => {
  const point = isCorrect ? 1 : 0;
  switch (category) {
    case Categories.HISTORY:
      player.historyPlayed++;
      player.historyWon += point;
      break;
    case Categories.GEOGRAPHY:
      player.geographyPlayed++;
      player.geographyWon += point;
      break;
    case Categories.FINANCE:
      player.financePlayed++;
      player.financeWon += point;
      break;
    case Categories.LOGO:
      player.logoPlayed++;
      player.logoWon += point;
      break;
    case Categories.TRIVIA:
      player.triviaPlayed++;
      player.triviaWon += point;
      break;
    case Categories.HIDDEN:
      player.hiddenPlayed++;
      player.hiddenWon += point;
      break;
    default:
      break;
  }
};

exports.isQuestionRequestValid = (category, level) => {
  if (
    Object.prototype.hasOwnProperty.call(Categories, category) &&
    Object.prototype.hasOwnProperty.call(Levels, level)
  ) {
    return true;
  }
  return false;
};

exports.generateRoomId = (activeRooms) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 5;
  let result = "";
  do {
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
  } while (activeRooms.has(result));
  return result;
};
