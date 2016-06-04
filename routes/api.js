'use strict';

var express = require('express');
var router = express.Router();

// router.use('/images', require('./images'));
router.use('/books', require('./books'));




module.exports = router;
