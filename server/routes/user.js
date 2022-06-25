const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.js');
const auth = require('../middleware/auth.js');

router.post('/login', userCtrl.connectProfile);
router.post('/signup', userCtrl.createProfile)
router.post('/getUserInfo:id', auth, userCtrl.getUserInfo)

module.exports = router;