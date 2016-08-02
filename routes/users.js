'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({storage: multer.memoryStorage()});

const User = require('../models/user');

router.post('/register', (req, res) => {
    console.log('req.body:', req.body);
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

router.put('/image/:id', upload.single('newFile'), (req, res) => {
    User.upload(req.file, (err, image) => {
        res.status(err? 400: 200).send(err || image);
    });
});

router.get('/profile', User.isLoggedIn, (req, res) => {
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
    res.clearCookie('accessToken').send();
});

router.get('/:id', User.auth(), (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) return res.status(400).send(err)

        res.send(user)
    }).populate('books followers following wishLists');
});

router.get('/', User.auth(), (req, res) => {
    User.find({}, (err, users) => {
        res.status(err ? 400 : 200).send(err || users);
    }).populate('books');
});

router.delete('/:id', User.auth(), (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if(err) return res.status(400).send(err);

        res.send();
    });
});

router.put('/:currentUserId/followUnfollow/:targetUserId', User.auth(), (req, res) => {
    let currentId = req.params.currentUserId;
    let targetId = req.params.targetUserId;
    User.followUnfollow(currentId, targetId, (err, updatedUser) => {
        res.status(err ? 400: 200).send(err || updatedUser);
    });
});

router.post('/sendMessage', (req, res) => {
    console.log('messageObj:', req.body);
    User.sendMessage(req.body, (err) => {
        res.status(err ? 400: 200).send(err || {message: 'email send successfully'});
    })
})

module.exports = router;
