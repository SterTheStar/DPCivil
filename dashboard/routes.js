const express = require('express');
const router = express.Router();
const RequestManager = require('../utils/requestManager');
const UserManager = require('../utils/userManager');
const BlacklistManager = require('../utils/blacklistManager');

const requestManager = new RequestManager();
const userManager = new UserManager();
const blacklistManager = new BlacklistManager();

router.get('/users', (req, res) => {
  const users = userManager.users;
  res.json(users);
});

router.get('/requests', (req, res) => {
  const requests = requestManager.requests;
  res.json(requests);
});

router.post('/requests/:token/accept', (req, res) => {
  const token = parseInt(req.params.token);
  const request = requestManager.getRequest(token)
    if(!request){
        return res.status(404).json({error: "Request not found"})
    }
  requestManager.updateRequest(token, { accepted: true })
  requestManager.deleteRequest(token)
  res.json({ message: `Request ${token} accepted.` });
});

router.post('/requests/:token/reject', (req, res) => {
    const token = parseInt(req.params.token);
    const request = requestManager.getRequest(token)
    if(!request){
        return res.status(404).json({error: "Request not found"})
    }
  requestManager.updateRequest(token, { rejected: true })
  requestManager.deleteRequest(token)
  res.json({ message: `Request ${token} rejected.` });
});

router.get('/blacklist', (req, res) => {
    const blacklist = blacklistManager.getBlacklist()
    res.json(blacklist)
})

router.get('/ranking', (req, res) => {
    const rankingType = req.query.type;
    const users = userManager.users
    let sortedUsers;
    if (rankingType === 'total') {
         sortedUsers = Object.entries(users)
            .sort(([, a], [, b]) => {
                const totalA = Object.values(a).reduce((sum, value) => sum + value, 0);
                const totalB = Object.values(b).reduce((sum, value) => sum + value, 0);
                return totalB - totalA;
            })
    } else if (rankingType === 'monthly') {
         sortedUsers = Object.entries(users)
            .filter(([, user]) => user.hasOwnProperty('monthly'))
            .sort(([, a], [, b]) => {
                const totalA = Object.values(a.monthly).reduce((sum, value) => sum + value, 0);
                const totalB = Object.values(b.monthly).reduce((sum, value) => sum + value, 0);
                return totalB - totalA;
            })
    } else{
        return res.status(404).json({error: "invalid type"})
    }
    res.json(sortedUsers)
});

module.exports = router;