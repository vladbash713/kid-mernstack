const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/categories', require('./categories'));
router.use('/children', require('./children'));

module.exports = router;