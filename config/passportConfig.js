const User = require("../models/userModel");
const passport = require("passport");

const FacebookStrategy = require("passport-facebook").Strategy;
const { getUserByFB, createUser } = require("../controllers/userController");
const { createFriends } = require("../controllers/friendsController");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "email",
        "friends",
        "picture.width(200).height(200)",
      ],
      scope: ["email", "user_friends"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user;
        user = await getUserByFB(profile.id);
        if (!user) {
          user = await createUser(profile);
          await createFriends(user, profile._json.friends.data);
        } else {
          await User.update(
            { profilePicUrl: profile.photos[0].value },
            { where: { facebookId: profile.id } },
          );
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
