const db = require('../config/db')

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

exports.getLikes = (req, res, next) => {
    db.query('SELECT * FROM likes', function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json({result})
        }
    })
}