const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post.js');
const auth = require('../middleware/auth.js');
const multer = require('../middleware/multer-config.js');

router.get('/getPosts', postCtrl.getPosts);
router.get('/getLikes', postCtrl.getLikes);
router.get('/getComments', postCtrl.getComments);
router.get('/getPostFromUser:id', auth, postCtrl.getPostFromUser);
router.post('/createPost', auth, multer, postCtrl.createPost);
router.put('/sendLike:id', auth, postCtrl.sendLike);
router.put('/updatePost:id', auth, multer, postCtrl.updatePost);
router.put('/updateComment:id', auth, postCtrl.updateComment);
router.post('/deletePost:id', auth, postCtrl.deletePost);
router.post('/deleteComment:id', auth, postCtrl.deleteComment);
router.post('/createComment', auth, postCtrl.createComment);

module.exports = router;