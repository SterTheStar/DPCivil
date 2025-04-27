const express = require('express');
const path = require('path');
const fs = require('fs');
const RequestManager = require('../utils/requestManager');
const UserManager = require('../utils/userManager');
const BlacklistManager = require('../utils/blacklistManager');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const requestManager = new RequestManager();
const userManager = new UserManager();
const blacklistManager = new BlacklistManager()

app.get('/api/requests', (req, res) => {
  res.json(requestManager.requests);
});

app.get('/api/users', (req, res) => {
  res.json(userManager.users);
});

app.get('/api/blacklist', (req, res) => {
    res.json(blacklistManager.getBlacklist())
})

app.post('/api/requests/:token/accept', (req, res) => {
  const token = parseInt(req.params.token);
  const request = requestManager.getRequest(token);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  const { type, quantity, memberId } = request;
  userManager.addItem(memberId, type, quantity);
  requestManager.updateRequest(token, { accepted: true });
  requestManager.deleteRequest(token);

  res.json({ message: `Request ${token} accepted` });
});

app.post('/api/requests/:token/reject', (req, res) => {
  const token = parseInt(req.params.token);
  const request = requestManager.getRequest(token);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }
  requestManager.updateRequest(token, { rejected: true })
  requestManager.deleteRequest(token);

  res.json({ message: `Request ${token} rejected` });
});

app.get('/api/ranking/:type', (req, res) => {
    const { type } = req.params
    const users = userManager.users
    let sortedUsers;

    if (type === 'total') {
         sortedUsers = Object.entries(users)
            .sort(([, a], [, b]) => {
                const totalA = Object.values(a).reduce((sum, value) => sum + value, 0);
                const totalB = Object.values(b).reduce((sum, value) => sum + value, 0);
                return totalB - totalA;
            })
    } else if (type === 'monthly') {
         sortedUsers = Object.entries(users)
            .filter(([, user]) => user.hasOwnProperty('monthly'))
            .sort(([, a], [, b]) => {
                const totalA = Object.values(a.monthly).reduce((sum, value) => sum + value, 0);
                const totalB = Object.values(b.monthly).reduce((sum, value) => sum + value, 0);
                return totalB - totalA;
            })
    } else{
        return res.status(400).json({ message: 'Invalid ranking type.' });
    }

    const ranking = sortedUsers.map(([userId, userData]) => {
        let total;
        if(type === 'total'){
            total = Object.values(userData).reduce((sum, value) => sum + value, 0)
        }else if(type === 'monthly'){
            total = Object.values(userData.monthly).reduce((sum, value) => sum + value, 0)
        }
        
        return {userId, total}
    })
    res.json(ranking)
})


module.exports = {app, port};