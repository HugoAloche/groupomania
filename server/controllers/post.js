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

exports.getLikes = (req, res, next) => {
    db.query('SELECT * FROM likes', function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json({result})
        }
    })
}

exports.getComments = (req, res, next) => {
    db.query('SELECT * FROM comments ORDER BY idcomments DESC', function (err, result) {
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
            else {
                db.query('SELECT * FROM comments WHERE idPost = ?', [req.params.id], function (err, result) {
                    if (err) throw err;
                    else if (result != null) {
                        result.forEach(element => {
                            db.query('DELETE FROM comments WHERE idcomments = ?', [element.idcomments], function (err, result) {
                                if (err) throw err;
                            })
                        })
                    }
                })
            }
            db.query('DELETE FROM posts WHERE idposts = ?', [req.params.id], function (err, result) {
                if (err) throw err;
                else {
                    res.status(200).json({result})
                }
            })
            db.query('DELETE FROM comments WHERE idPost = ?', [req.params.id], function (err, result) {
                if (err) throw err;
            })
            db.query('DELETE FROM likes WHERE idPost = ?', [req.params.id], function (err, result) {
                if (err) throw err;
            })
        }
    })
}

exports.createComment = (req, res, next) => {
    db.query('SELECT pseudo FROM users WHERE idusers = ?', [req.body.idUser], function (err, result) {
        if (err) throw err;
        else {
            const now = new Date().toISOString().replace('T', ' ').split(' ')[0];
            db.query('INSERT INTO comments (idPost, author, comment, date, idUser) VALUES (?, ?, ?, ?, ?)', [req.body.idPost, result[0].pseudo, req.body.comment, now, req.body.idUser], (err, result) => {
                if (err) throw err;
                else {
                    res.status(200).json({result})
                }
            })
        }
    })
}

exports.deleteComment = (req, res, next) => {
    db.query('DELETE FROM comments WHERE idcomments = ?', [req.params.id], function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json({result})
        }
    })
}

exports.updateComment = (req, res, next) => {
    db.query(`UPDATE comments SET comment = '${req.body.comment}' WHERE idcomments = ${req.params.id}`, function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json({result})
        }
    })
}

exports.sendLike = (req, res, next) => {
    if (req.body.value === 0) {
        db.query('DELETE FROM likes WHERE idUser = ? AND idPost = ?', [req.body.idUser, req.params.id], function (err, result) {
            if (err) throw err;
            else {
                res.status(200).json({result})
            }
        })
    } else {
        db.query(`SELECT * FROM likes WHERE idPost = ${req.params.id}`, function (err, result) {
            if (err) throw err;
            else {
                if (result.length > 0) {
                    let exist = 0;
                    result.forEach(row => {
                        if (row.idUser === req.body.idUser) {
                            exist -= 1;
                        } else if (row.idUser !== req.body.idUser) {
                            exist += 1;
                        }
                    })
                    if (result.length === exist) {
                        db.query('INSERT INTO likes (idPost, idUser, value) VALUES (?, ?, ?)', [req.params.id, req.body.idUser, req.body.value], (err, result) => {
                            if (err) throw err;
                            else {
                                res.status(200).json({result})
                            }
                        })
                    } else {
                        db.query(`UPDATE likes SET value = '${req.body.value}' WHERE idPost = ${req.params.id} AND idUser = ${req.body.idUser}`, function (err, result) {
                            if (err) throw err;
                            else {
                                res.status(200).json({result})
                            }
                        })
                    }
                } else {
                    db.query('INSERT INTO likes (idPost, idUser, value) VALUES (?, ?, ?)', [req.params.id, req.body.idUser, req.body.value], (err, result) => {
                        if (err) throw err;
                        else {
                            res.status(200).json({result})
                        }
                    })
                }
            }
        })
    }
}