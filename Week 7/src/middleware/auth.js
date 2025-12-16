const bcrypt = require('bcrypt');

const SALT_ROUND = 10;

const checkLoggedIn = function (req, res, next) {
  if (req.session.loggedIn === true) {
    next();
  } else {
    res.redirect("/login");
  }
};

const requireLogin = (req, res, next) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login?next=' + req.originalUrl);
  }
  next();
};

const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.loggedIn) {
    return res.redirect('/users');
  }
  next();
};

async function genHashPassword(plaintextPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_ROUND, function (err, salt) {
      if (err) reject(false);
      bcrypt.hash(plaintextPassword, salt, function(err, hashedPassword) {
        if (err) reject(false);
        return resolve(hashedPassword);
      });
    });
  });
}

module.exports = {
  checkLoggedIn,
  requireLogin,
  redirectIfLoggedIn,
  genHashPassword,
  SALT_ROUND
};
