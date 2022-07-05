const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/likes.js');
const auth = require('../middleware/auth.js');

router.get('/getLikes', likeCtrl.getLikes);
router.put('/sendLike:id', auth, likeCtrl.sendLike);

module.exports = router;