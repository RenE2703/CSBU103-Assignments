const router = require('express').Router();
const UserModel = require('../models');
const { checkLoggedIn, genHashPassword } = require('../middleware/auth');
const bcrypt = require('bcrypt');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now().toString());
  next();
});

router.get('/', async function (req, res) {
  try {
    if (req.session.loggedIn) {
      const users = await UserModel.find({});
      console.log(users);
      res.render('user', { 
        title: 'Users',
        data: users || [] 
      });
    } else {
      const users = await UserModel.find({});
      console.log(users);
      res.json({
        success: true,
        users: users || []
      });
    }
  } catch (error) {
    console.log(error);
    if (req.session.loggedIn) {
      res.render('user', { 
        title: 'Users',
        data: [],
        error: 'Unable to fetch users'
      });
    } else {
      res.json({
        success: false,
        message: 'Unable to fetch users',
        users: []
      });
    }
  }
});

// GET: Get user by username
// GET: Get user by username
router.get('/:username', async function (req, res) {
  try {
    const { username } = req.params;
    const user = await UserModel.findOne({ username: username });
    console.log(user);
    if (user) {
      res.json({ status: true, data: user });
    } else {
      res.status(404).json({ status: false, msg: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, msg: 'Error fetching user', error });
  }
});

// POST: Register new user (JSON API)
router.post('/', async function (req, res) {
  try {
    const { username, name, gender, password } = req.body;
    if (!username || !name || !password) {
      return res.status(400).json({
        status: false,
        msg: 'Username, name, and password are required'
      });
    }

    const existingUser = await UserModel.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        msg: 'Username already exists'
      });
    }

    const newUser = new UserModel({
      username: username,
      name: name,
      gender: gender || '',
      password: await genHashPassword(password)
    });

    try {
      const createdUser = await newUser.save();
      res.status(201).json({ 
        status: true, 
        data: createdUser,
        msg: 'User created successfully'
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        msg: 'Unable to insert new user',
        error: error.message
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      msg: 'Server error',
      error: error.message
    });
  }
});

// POST: Register from form
router.post('/register', async function (req, res) {
  try {
    const { username, name, gender, password } = req.body;
    console.log(req.body);

    if (!username || !name || !password) {
      return res.render('register', {
        title: 'Register',
        error: 'All fields are required'
      });
    }

    const existingUser = await UserModel.findOne({ username: username });
    if (existingUser) {
      return res.render('register', {
        title: 'Register',
        error: 'Username already exists'
      });
    }

    const newUser = new UserModel({
      username: username,
      name: name,
      gender: gender || '',
      password: await genHashPassword(password)
    });

    try {
      const createdUser = await newUser.save();
      console.log('User registered successfully:', createdUser);
      res.redirect('/login');
    } catch (error) {
      console.log(error);
      res.render('register', {
        title: 'Register',
        error: 'Unable to register user. Please try again.'
      });
    }
  } catch (error) {
    console.log(error);
    res.render('register', {
      title: 'Register',
      error: 'Server error. Please try again.'
    });
  }
});

// POST: Handle login
router.post('/login', async function(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render("login", { 
        title: 'Login',
        error: 'Username and password are required!'
      });
    }

    const user = await UserModel.findOne({ username: username });
    console.log(user);

    if (!user || user.username !== username || !bcrypt.compareSync(password, user.password)) {
      return res.render("login", { 
        title: 'Login',
        error: 'Username or password is not correct!'
      });
    }

    // Login successful
    console.log('LOGIN SUCCEEDED');
    req.session.loggedIn = true;
    req.session.user = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.username
    };

    res.redirect('/users');
  } catch(error) {
    console.log(error);
    res.render("login", { 
      title: 'Login',
      error: 'Username or password is not correct!'
    });
  }
});

// DELETE: Delete user by id
router.delete('/:id', async function (req, res) {
  try {
    const { id } = req.params;
    const result = await UserModel.deleteOne({ _id: id });
    console.log(result);
    res.status(200).json({ 
      status: true, 
      message: "User deleted successfully!" 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: 'Unable to delete user',
      error: error.message
    });
  }
});

// PUT: Update user by id
router.put('/:userId', async function (req, res) {
  try {
    const { userId } = req.params;
    const { username, name, gender } = req.body;

    if (!userId) {
      return res.status(404).json({
        status: false,
        msg: 'User ID is required'
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { username, name, gender },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        msg: 'User not found'
      });
    }

    console.log(updatedUser);
    res.status(200).json({
      status: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      msg: 'Unable to update user',
      error: err.message
    });
  }
});

module.exports = router;
