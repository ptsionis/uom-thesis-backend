const passport = require("passport");

exports.facebookAuth = passport.authenticate("facebook");

exports.facebookCallback = passport.authenticate("facebook", {
  failureRedirect: `${process.env.CLIENT_ORIGIN}/`,
  successRedirect: `${process.env.CLIENT_ORIGIN}/`,
});

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return null;
    }
    res.redirect(`${process.env.CLIENT_ORIGIN}/login`);
  });
};

exports.isAuthenticated = (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
};
