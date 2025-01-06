module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect(`${process.env.CLIENT_ORIGIN}/login`);
  }
  next();
};
