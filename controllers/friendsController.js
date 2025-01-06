const User = require("../models/userModel");
const Friend = require("../models/friendModel");

const sequelize = require("sequelize");

exports.createFriends = async (user, friends) => {
  try {
    if (friends && friends.length > 0) {
      const friendIds = friends.map((friend) => friend.id);

      const friendsFetched = await User.findAll({
        where: { facebookId: friendIds },
      });

      await Promise.all(
        friendsFetched.map(async (friendUser) => {
          await Friend.create({
            friendA: user.id,
            friendB: friendUser.id,
          });
        }),
      );
    }
    return;
  } catch (err) {
    console.log(err);
    return;
  }
};

exports.getFriends = async (id) => {
  if (!id) {
    return null;
  }

  try {
    const friendsList = await Friend.findAll({
      where: {
        [sequelize.Op.or]: [{ friendA: id }, { friendB: id }],
      },
    });

    const friendIds = friendsList.map((friend) =>
      friend.friendA === id ? friend.friendB : friend.friendA,
    );

    const friends = await User.findAll({
      where: { id: friendIds },
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
    return friends;
  } catch (err) {
    console.log(err);
    return null;
  }
};
