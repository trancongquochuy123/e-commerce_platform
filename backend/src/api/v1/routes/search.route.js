const express = require('express');
const router = express.Router();

const controller = require('../controllers/search.controller');

/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     summary: Search products
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/', controller.index);

module.exports = router;