const Roles = require("../enums/rolesEnum");
const User = require("../models/userModel");
const Scores = require("../enums/scoresEnum");

exports.createUser = async (profile) => {
  try {
    let user = await User.create({
      username: profile.displayName,
      email: profile?.emails ? profile.emails[0].value : null,
      profilePicUrl: profile?.photos ? profile.photos[0].value : null,
      facebookId: profile.id,
      role: Roles.USER,
    });

    return user;
  } catch (err) {
    console.log("Error creating user", err);
    return null;
  }
};

exports.getUserByFB = async (id) => {
  try {
    let user = await User.findOne({ where: { facebookId: id } });
    return user;
  } catch (err) {
    console.log("Error finding user by FB", err);
  }
  return null;
};

exports.getUser = async (userId) => {
  try {
    if (userId) {
      const user = await User.findByPk(userId, {
        attributes: [
          "id",
          "username",
          "role",
          "email",
          "profilePicUrl",
          "score",
          "gamesPlayed",
          "gamesWon",
          "historyPlayed",
          "historyWon",
          "geographyPlayed",
          "geographyWon",
          "financePlayed",
          "financeWon",
          "logoPlayed",
          "logoWon",
          "triviaPlayed",
          "triviaWon",
          "hiddenPlayed",
          "hiddenWon",
          "createdAt",
        ],
      });
      return user;
    } else {
      //TO-DO: modify back+front in case profile cannot be sent
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getUserForGame = async (id) => {
  const userId = id;
  try {
    if (userId) {
      const profile = await User.findByPk(userId, {
        attributes: [
          "id",
          "username",
          "profilePicUrl",
          "score",
          "gamesPlayed",
          "gamesWon",
          "historyPlayed",
          "historyWon",
          "geographyPlayed",
          "geographyWon",
          "financePlayed",
          "financeWon",
          "logoPlayed",
          "logoWon",
          "triviaPlayed",
          "triviaWon",
          "hiddenPlayed",
          "hiddenWon",
          "createdAt",
        ],
      });
      return profile.dataValues;
    } else {
      return null;
    }
  } catch (err) {
    console.log("Error getting user", err);
    return null;
  }
};

exports.punishUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      await user.decrement("score", { by: Scores.LOSS_PUNISH });
    }
  } catch (err) {
    console.log("Could not punish user", err);
    return null;
  }
};

exports.updateUserAfterGame = async (userId, user) => {
  console.log("UUU", user);
  try {
    await User.update(
      {
        score: user.score,
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
        historyPlayed: user.historyPlayed,
        historyWon: user.historyWon,
        geographyPlayed: user.geographyPlayed,
        geographyWon: user.geographyWon,
        financePlayed: user.financePlayed,
        financeWon: user.financeWon,
        logoPlayed: user.logoPlayed,
        logoWon: user.logoWon,
        triviaPlayed: user.triviaPlayed,
        triviaWon: user.triviaWon,
        hiddenPlayed: user.hiddenPlayed,
        hiddenWon: user.hiddenWon,
      },
      { where: { id: userId } },
    );
  } catch (err) {
    console.log("Could not update player stats", err);
  }
};
