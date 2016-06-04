'use strict';

var express = require('express');
var router = express.Router();

var User = require('../models/user');


router.post('/register', (req, res) => {
    console.log(req.body);
    User.register(req.body, (err, savedUser) => {
        res.status(err ? 400 : 200).send(err || savedUser);
    });
});

router.post('/authenticate', (req, res) => {
    User.authenticate(req.body, (err, token, dbUser) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.cookie('accessToken', token).send();
        }
    });
});
router.get('/profile', User.isLoggedIn, (req, res) => {
    console.log('routing2', req.user);
    res.send(req.user);
});

router.put('/:id', User.auth(), (req, res) => {
    User.edit(req.params.id, req.body, (err, editedUser) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(editedUser);
        }
    });
});

router.post('/logout', (req, res) => {
    console.log('logout routing:');
    res.clearCookie('accessToken').send();
});

router.get('/', User.auth(), (req, res) => {
    console.log('req.queries:', req.queries);
    User.find({}, (err, users) => {
        res.status(err ? 400 : 200).send(err || users);
    }).select('-password');
});

router.get('/:id', User.auth(), (req, res) => {
    User.find(req.params.id, (err, user) => {
        if (err) return res.status(400).send(err)

        res.send(user)
    }).select('-password');
});

router.delete('/:id', User.auth(), (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if(err) return res.status(400).send(err);

        res.send();
    })
})


module.exports = router;
