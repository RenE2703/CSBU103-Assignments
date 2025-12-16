const router = require('express').Router();
const UserModel = require('../models');
const { checkLoggedIn } = require('../middleware/auth');

// GET: Home page
router.get('/', async(req, res) => {
  try {
    const users = await UserModel.find({});
    res.render('index', { 
      title: 'Home',
      users: users || []
    });
  } catch (error) {
    console.log(error);
    res.render('index', { 
      title: 'Home',
      users: []
    });
  }
});

// GET: Login page
router.get('/login', function(req, res) {
  if(req.session.loggedIn) res.redirect('/users');
  res.render('login', { title: 'Login' });
});

// GET: Register page
router.get('/register', function(req, res) {
  res.render('register', { title: 'Register' });
});

// GET: Dashboard (protected)
router.get('/dashboard', checkLoggedIn, async(req, res) => {
  try {
    res.render('dashboard', { 
      title: 'Dashboard',
      user: req.session.user
    });
  } catch (error) {
    console.log(error);
    res.render('dashboard', { 
      title: 'Dashboard',
      user: req.session.user
    });
  }
});

module.exports = router;
