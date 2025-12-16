const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return { users: [] };
    }
  }

  save() {
    fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  getUsers() {
    return this.data.users || [];
  }

  addUser(user) {
    if (!this.data.users) {
      this.data.users = [];
    }
    this.data.users.push(user);
    this.save();
    return user;
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  }

  setUsers(users) {
    this.data.users = users;
    this.save();
  }
}

module.exports = new Database();
