const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const app = express();

const userModel = require('./models');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  name: "app",
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

app.use(expressLayouts);

// Middleware to pass session to views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.loggedIn = req.session.loggedIn || false;
  next();
});

const { indexController, userController } = require('./controllers');

app.use('/', indexController);
app.use('/users', userController);

const logout = function(req, res, next) {
  req.session.loggedIn = false;
  req.session.user = null;
  res.redirect("/");
};

app.get("/logout", logout);

app.use('/week2-cv', express.static(path.join(__dirname, '../../Week2/CV')));
app.use('/week4-calculator', express.static(path.join(__dirname, '../../Week4/Calculator')));
app.use('/week4-gallery', express.static(path.join(__dirname, '../../Week4/Photo Gallery Viewer')));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
