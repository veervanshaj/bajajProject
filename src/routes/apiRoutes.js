const express = require('express');
const router = express.Router();
const bfhlController = require('../controllers/bfhlController');
const healthController = require('../controllers/healthController');

router.post('/bfhl', bfhlController.handleBfhl);
router.get('/health', healthController.checkHealth);

module.exports = router;
