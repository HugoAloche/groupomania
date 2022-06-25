const db = require('../config/db')
const fs = require('fs');

exports.getPosts = (req, res, next) => {
    db.query('SELECT * FROM posts ORDER BY idposts DESC', function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json({result})
        }
    })
}

exports.getPostFromUser = (req, res, next) => {
    db.query('SELECT * FROM posts WHERE idusers = ? ORDER BY idposts DESC', [req.params.id], function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json({result})
        }
    })
}

exports.createPost = (req, res, next) => {
    db.query('SELECT pseudo FROM users WHERE idusers = ?', [req.body.idUser], function (err, result) {
        if (err) throw err;
        else {
            const now = new Date().toISOString().replace('T', ' ').split(' ')[0];
            if (req.file) {
                const url = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                db.query('INSERT INTO posts (title, content, author, date_creation, url, idusers) VALUES (?, ?, ?, ?, ?, ?)', [req.body.title, req.body.content, result[0].pseudo, now, url, req.body.idUser], function (err, result) {
                    if (err) throw err;
                    else {
                        res.status(200).json({result})
                    }
                })
            } else {
                db.query('INSERT INTO posts (title, content, author, date_creation, idusers) VALUES (?, ?, ?, ?, ?)', [req.body.title, req.body.content, result[0].pseudo, now, req.body.idUser], function (err, result) {
                    if (err) throw err;
                    else {
                        res.status(200).json({result})
                    }
                })
            }
        }
    })
}

exports.updatePost = (req, res, next) => {
            const now = new Date().toISOString().replace('T', ' ').split(' ')[0];
            if (req.file) {
                db.query('SELECT * FROM posts WHERE idposts = ?', [req.params.id], function (err, result) {
                    if (err) throw err;
                    if (result[0].url) {
                        const filename = result[0].url.split('/images/')[1];
                        fs.unlink(`images/${filename}`, (err) => {
                            if (err) throw err;
                        })
                    }
                })
                const url = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                db.query(`UPDATE posts SET title = '${req.body.title}', content = '${req.body.content}', date_modification = '${now}', url = '${url}' WHERE idposts = ${req.params.id}`, function (err, result) {
                    if (err) throw err;
                    else {
                        res.status(200).json({result})
                    }
                })
            } else {
                db.query(`UPDATE posts SET title = '${req.body.title}', content = '${req.body.content}', date_modification = '${now}' WHERE idposts = ${req.params.id}`, function (err, result) {
                    if (err) throw err;
                    else {
                        res.status(200).json({result})
                    }
                })
            }
        }

exports.deletePost = (req, res, next) => {
    db.query('SELECT * FROM posts WHERE idposts = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        else {
            if (result[0].url) {
                const filename = result[0].url.split('/images/')[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if (err) throw err;
                })
            }
            db.query('DELETE FROM posts WHERE idposts = ?', [req.params.id], function (err, result) {
                if (err) throw err;
                else {
                    res.status(200).json({result})
                }
            })
        }
    })
}