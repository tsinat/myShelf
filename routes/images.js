'use strict';

const express = require('express');
const multer = require('multer');

let router = express.Router();
let upload = multer({storage: multer.memoryStorage()});

let User = require('../models/user');
let Book = require('../models/book');

//   /api/images

router.put('/books/:id', upload.single('newFile'), (req, res) => {
    console.log('book cover:');
    Book.upload(req.file, req.params.id, (err, image) => {
        res.status(err ? 400: 200).send(err || image);
    });
});

router.put('/:id', upload.single('newFile'), (req, res) => {
    console.log('routingimage');
  User.upload(req.file, req.params.id, (err, image) => {
    console.log('image:', image);

    res.status(err? 400: 200).send(err || image);
  });
});


module.exports = router;
