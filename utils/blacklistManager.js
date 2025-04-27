const fs = require('fs');
const path = require('path');

class BlacklistManager {
  constructor() {
    this.dataFilePath = path.join(__dirname, '..', 'data', 'blacklist.json');
    this.blacklist = this.loadBlacklist();
  }

  loadBlacklist() {
    try {
      const data = fs.readFileSync(this.dataFilePath);
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveBlacklist() {
    const data = JSON.stringify(this.blacklist, null, 2);
    fs.writeFileSync(this.dataFilePath, data);
  }

  addToBlacklist(userId) {
    if (!this.isBlacklisted(userId)) {
      this.blacklist.push(userId);
      this.saveBlacklist();
      return true;
    }
    return false;
  }

  removeFromBlacklist(userId) {
    const index = this.blacklist.indexOf(userId);
    if (index > -1) {
      this.blacklist.splice(index, 1);
      this.saveBlacklist();
      return true;
    }
    return false;
  }

  isBlacklisted(userId) {
    return this.blacklist.includes(userId);
  }

  getBlacklist(){
    return this.blacklist
  }
}

module.exports = BlacklistManager;