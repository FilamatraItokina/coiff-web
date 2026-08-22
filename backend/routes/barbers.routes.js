const express = require('express');
const { getBarbers } = require('../controllers/barbers.controller');

const router = express.Router();

router.get('/', getBarbers);

module.exports = router;
