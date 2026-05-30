const express = require('express');
const router = express.Router();
const { getChannelStats } = require('../controllers/statsController');

router.get('/', getChannelStats);

module.exports = router;