const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'users.json');

class UserManager {


  constructor() {
    this.users = this.loadUsers();
  }

  loadUsers() {
    try {
      const data = fs.readFileSync(dataFilePath);
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  saveUsers() {
    const data = JSON.stringify(this.users, null, 2);
    fs.writeFileSync(dataFilePath, data);
  }

  resetMonthly(){
      for (const userId in this.users) {
        if (this.users.hasOwnProperty(userId)) {
            this.users[userId].monthly = {};
        }
      }
      this.saveUsers()
  }

  getUser(userId) {
    if (!this.users[userId]){
      return this.addUser(userId, {})
    }
    return this.users[userId];
  }

  addUser(userId, userData) {
    this.users[userId] = userData;
    this.saveUsers();
    return userData;
  }

  removeUser(userId) {
    if (this.users[userId]) {
      delete this.users[userId];
      this.saveUsers();
      return true;
    }
    return false;
  }
  updateUser(userId, updatedData) {
    if(this.users[userId]){
        this.users[userId] = {...this.users[userId], ...updatedData}
        this.saveUsers()
        return this.users[userId]
    }
    return null
  }
  addItem(userId, type, amount){
    const user = this.getUser(userId)
    if(!user[type]){
      user[type] = 0
    }
    user[type] += amount
    if(!user.monthly){
        user.monthly = {}
    }
    if(!user.monthly[type]){user.monthly[type]=0}
    user.monthly[type] += amount
    this.saveUsers()
  }
}

module.exports = UserManager;