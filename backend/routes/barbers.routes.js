const express = require('express');
const { getBarbers, getBarberById } = require('../controllers/barbers.controller');

const router = express.Router();

router.get('/', getBarbers);
router.get('/:id', getBarberById);

module.exports = router;
