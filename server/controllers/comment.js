const db = require('../config/db')

exports.getComments = (req, res, next) => {
    db.query('SELECT * FROM comments ORDER BY idcomments DESC', function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json({result})
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