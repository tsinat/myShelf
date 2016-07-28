'use strict';

const express = require('express');
const router = express.Router();

router.use('/images', require('./images'));
router.use('/books', require('./books'));




module.exports = router;
