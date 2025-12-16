const db = require('./db');
const fs = require('fs');
const path = require('path');

class UserModel {
  static find(query = {}) {
    return new Promise((resolve, reject) => {
      try {
        const users = db.getUsers();
        resolve(users || []);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findOne(query) {
    return new Promise((resolve, reject) => {
      try {
        const users = db.getUsers();
        if (!users) {
          resolve(null);
          return;
        }

        let user = null;
        if (query.username) {
          user = users.find(u => u.username === query.username);
        } else if (query.email) {
          user = users.find(u => u.email === query.email);
        } else if (query._id) {
          user = users.find(u => u._id === query._id);
        }

        resolve(user || null);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      try {
        const users = db.getUsers();
        const user = users.find(u => u._id === id);
        resolve(user || null);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findByIdAndUpdate(id, updateData, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const users = db.getUsers();
        const userIndex = users.findIndex(u => u._id === id);

        if (userIndex === -1) {
          resolve(null);
          return;
        }

        users[userIndex] = {
          ...users[userIndex],
          ...updateData
        };
        db.setUsers(users);
        resolve(users[userIndex]);
      } catch (error) {
        reject(error);
      }
    });
  }

  constructor(userData) {
    this._id = userData._id || Date.now().toString();
    this.username = userData.username;
    this.name = userData.name;
    this.email = userData.email || userData.username; // Support both
    this.password = userData.password;
    this.gender = userData.gender || '';
    this.contactNo = userData.contactNo || '';
    this.createdAt = userData.createdAt || new Date();
  }

  save() {
    return new Promise((resolve, reject) => {
      try {
        const users = db.getUsers() || [];

        const existingUser = users.find(u => u.username === this.username);
        if (existingUser) {
          reject(new Error('Username already exists'));
          return;
        }
        const newUser = {
          _id: this._id,
          username: this.username,
          name: this.name,
          email: this.email,
          password: this.password,
          gender: this.gender,
          contactNo: this.contactNo,
          createdAt: this.createdAt
        };

        users.push(newUser);
        db.setUsers(users);
        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteOne(query) {
    return new Promise((resolve, reject) => {
      try {
        const users = db.getUsers();
        const userIndex = users.findIndex(u => {
          if (query._id) return u._id === query._id;
          if (query.username) return u.username === query.username;
          return false;
        });

        if (userIndex === -1) {
          resolve({ deletedCount: 0 });
          return;
        }

        const deletedUser = users[userIndex];
        users.splice(userIndex, 1);
        db.setUsers(users);

        resolve({ deletedCount: 1, deletedUser });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateOne(query, updateData) {
    return new Promise((resolve, reject) => {
      try {
        const users = db.getUsers();
        const userIndex = users.findIndex(u => {
          if (query._id) return u._id === query._id;
          if (query.username) return u.username === query.username;
          return false;
        });

        if (userIndex === -1) {
          resolve({ modifiedCount: 0 });
          return;
        }

        users[userIndex] = {
          ...users[userIndex],
          ...updateData
        };

        db.setUsers(users);
        resolve({ modifiedCount: 1 });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = UserModel;
