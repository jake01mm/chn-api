const express = require('express');
const VerificationController = require('./verification.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Verification
 *   description: Verification code related operations
 */

/**
 * @swagger
 * /verification/send/register:
 *   post:
 *     summary: Send a verification code for user registration
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               type:
 *                 type: string
 *                 example: register
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification code sent successfully
 *       400:
 *         description: Bad request
 */
router.post('/send/register', (req, res) => {
  VerificationController.sendCode(req, res, 'register');
});

/**
 * @swagger
 * /verification/verify/register:
 *   post:
 *     summary: Verify a registration verification code
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               type:
 *                 type: string
 *                 example: register
 *               code:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification successful
 *       400:
 *         description: Verification failed
 */
router.post('/verify/register', (req, res) => {
  VerificationController.verifyCode(req, res, 'register');
});

/**
 * @swagger
 * /verification/send/withdrawal:
 *   post:
 *     summary: Send a verification code for wallet withdrawal
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification code sent successfully
 *       400:
 *         description: Bad request
 */
router.post('/send/withdrawal', (req, res) => {
  VerificationController.sendCode(req, res, 'withdrawal');
});

/**
 * @swagger
 * /verification/verify/withdrawal:
 *   post:
 *     summary: Verify a withdrawal verification code
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               code:
 *                 type: string
 *                 example: 654321
 *     responses:
 *       200:
 *         description: Verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification successful
 *       400:
 *         description: Verification failed
 */
router.post('/verify/withdrawal', (req, res) => {
  VerificationController.verifyCode(req, res, 'withdrawal');
});

module.exports = router;