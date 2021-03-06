const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path')

const userRoutes = require('./routes/user.js');
const postRoutes = require('./routes/post.js');
const likeRoutes = require('./routes/likes.js');
const commentRoutes = require('./routes/comments.js');

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/auth', postRoutes);
app.use('/api/auth', likeRoutes);
app.use('/api/auth', commentRoutes);

module.exports = app;