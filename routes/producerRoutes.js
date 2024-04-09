// producerRoutes.js

const express = require('express');
const router = express.Router();
const producerController = require('../controllers/producerController');

router.get('/all', producerController.getAllProducers);

module.exports = router;
