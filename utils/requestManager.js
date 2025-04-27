const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'requests.json');

class RequestManager {
  constructor() {
    this.requests = this.loadRequests();
  }

  loadRequests() {
    try {
      const data = fs.readFileSync(dataFilePath);
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveRequests() {
    const data = JSON.stringify(this.requests, null, 2);
    fs.writeFileSync(dataFilePath, data);
  }

  addRequest(request) {
    this.requests.push(request);
    this.saveRequests();
    return request;
  }

  getRequest(token) {
    return this.requests.find(req => req.token === token);
  }

  deleteRequest(token) {
    const index = this.requests.findIndex(req => req.token === token);
    if (index !== -1) {
      this.requests.splice(index, 1);
      this.saveRequests();
      return true;
    }
    return false;
  }
  
  getAllRequestsByUser(userId) {
    return this.requests.filter(req => req.memberId === userId);
  }

  updateRequest(token, updatedRequest) {
    const index = this.requests.findIndex(req => req.token === token);
    if (index !== -1) {
      this.requests[index] = { ...this.requests[index], ...updatedRequest };
      this.saveRequests();
      return this.requests[index];
    }
    return null;
  }
}

module.exports = RequestManager;