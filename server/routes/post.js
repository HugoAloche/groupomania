const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post.js');
const auth = require('../middleware/auth.js');
const multer = require('../middleware/multer-config.js');

router.get('/getPosts', postCtrl.getPosts);
router.get('/getComments', postCtrl.getComments);
router.get('/getPostFromUser:id', auth, postCtrl.getPostFromUser);
router.post('/createPost', auth, multer, postCtrl.createPost);
router.put('/updatePost:id', auth, multer, postCtrl.updatePost);
router.post('/deletePost:id', auth, postCtrl.deletePost);
router.post('/createComment', auth, postCtrl.createComment);

module.exports = router;