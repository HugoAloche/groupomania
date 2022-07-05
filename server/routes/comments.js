const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment.js');
const auth = require('../middleware/auth.js');

router.get('/getComments', commentCtrl.getComments);
router.put('/updateComment:id', auth, commentCtrl.updateComment);
router.post('/deleteComment:id', auth, commentCtrl.deleteComment);
router.post('/createComment', auth, commentCtrl.createComment);

module.exports = router;