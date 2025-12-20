const express = require('express');
const router = express.Router();

const controller = require('../controllers/home.controller.js');

router.get('/', controller.getHomeProducts);

module.exports = router;