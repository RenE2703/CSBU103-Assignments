const UserModel = require('../models');
const crypto = require('crypto');

exports.register = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Frontend validation should have caught this, but validate on backend too
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'Passwords do not match' 
    });
  }

  try {
    const newUser = UserModel.create({
      email: email,
      password: password
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render('login', {
      title: 'Login',
      error: 'Email and password are required'
    });
  }

  try {
    const user = UserModel.getByEmail(email);

    if (!user) {
      return res.status(401).render('login', {
        title: 'Login',
        error: 'Invalid email or password'
      });
    }

    // Hash the entered password and compare
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    if (hashedPassword !== user.password) {
      return res.status(401).render('login', {
        title: 'Login',
        error: 'Invalid email or password'
      });
    }

    // Create session
    req.session.user = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    };

    res.redirect('/dashboard');
  } catch (error) {
    return res.status(500).render('login', {
      title: 'Login',
      error: error.message
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Error logging out');
    }
    res.redirect('/');
  });
};

exports.getUsers = (req, res) => {
  try {
    const users = UserModel.getAll();
    const usersDisplay = users.map(u => ({
      id: u.id,
      email: u.email,
      createdAt: u.createdAt
    }));
    res.json({ success: true, users: usersDisplay });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
