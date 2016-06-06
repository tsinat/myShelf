'use strict';

const express = require('express');
const multer = require('multer');

let router = express.Router();
let upload = multer({storage: multer.memoryStorage()});

let User = require('../models/user');

//   /api/images

router.put('/:id', upload.single('newFile'), (req, res) => {
    console.log('routingimage');
  User.upload(req.file, req.params.id, (err, image) => {
    console.log('image:', image);

    res.status(err? 400: 200).send(err || image);
  });
});

module.exports = router;
