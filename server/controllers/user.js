const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db')

exports.createProfile = (req, res, next) => {
    const {email, pseudo, password } = req.body;

    db.query(`SELECT email FROM users WHERE email = '${email}'`, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            res.status(401).json({ error: 'Email déjà utilisé' })
        } else {
            bcrypt.hash(password, 10)
                .then(hash => {
                    db.query(`INSERT INTO users (pseudo, email, password) VALUES ('${pseudo}','${email}','${hash}')`, function (err, result) {
                        if (err) { throw err;}
                        else {
                            res.status(201).json({ message: 'Utilisateur créé' })
                        }
                        });
                })
                .catch(error => { res.status(500).json({ error: error }) })
            }
      });
}

exports.connectProfile = (req, res, next) => {
    const {email, password } = req.body;
    db.query(`SELECT email, password, idusers FROM users WHERE email = '${email}'`, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
        bcrypt.compare(password, result[0].password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect' })
            }
            res.status(200).json({
                userId: result[0].idusers,
                token: jwt.sign({ userId: result[0].idusers },
                    'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                )
            })
        })
        .catch(error => {
            res.status(500).json({ error: error })
        })
    } else {
        res.status(401).json({ error: 'Aucun compte avec cet e-mail' })
    }
    });
}

exports.getUserInfo = (req, res, next) => {
    const id = req.params.id
    db.query(`SELECT pseudo, email FROM users WHERE idusers = ${id}`, function (err, result) {
        if (err) throw err;
        res.send(result)
    });
}