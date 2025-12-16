const crypto = require('crypto');

// Placeholder for MongoDB model
// To use MongoDB, configure your connection string in environment

class UserModel {
  // Validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password
  static validatePassword(password) {
    // At least 6 characters, contains at least 1 number and 1 special character
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
  }

  // Create new user
  static async create(userData) {
    // Validate email
    if (!this.validateEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password
    if (!this.validatePassword(userData.password)) {
      throw new Error('Password must be at least 6 characters, contain at least 1 number and 1 special character');
    }

    // MongoDB implementation would go here
    const newUser = {
      email: userData.email,
      password: crypto.createHash('sha256').update(userData.password).digest('hex'),
      createdAt: new Date()
    };

    return newUser;
  }
}

module.exports = UserModel;
