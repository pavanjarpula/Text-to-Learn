// backend/middlewares/attachUser.js
const attachUser = (req, res, next) => {
  if (req.auth && req.auth.payload && req.auth.payload.sub) {
    req.user = { sub: req.auth.payload.sub };
  }
  next();
};

module.exports = attachUser;
