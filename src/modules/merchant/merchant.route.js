'use strict';

const express = require('express');
const MerchantController = require('./merchant.controller');
const router = express.Router();

/**
 * @swagger
 * /merchant/login:
 *   post:
 *     tags: [Merchant]
 *     summary: Merchant login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', MerchantController.login);

module.exports = router;