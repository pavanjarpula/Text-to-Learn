// backend/middlewares/attachUser.js
const attachUser = (req, res, next) => {
  if (req.auth) {
    req.user = { sub: req.auth.sub }; // attach user info from JWT
  }
  next();
};

module.exports = attachUser;
