const express = require('express');
const AdminController = require('./admin.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const logger = require('../../utils/logger');
const AdminService = require('./admin.service');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and operations
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', AdminController.login);

/**
 * @swagger
 * /admin/create-merchant:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new merchant account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - phone_number
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               phone_number:
 *                 type: string
 */
router.post('/create-merchant', authMiddleware(['admin']), AdminController.createMerchant);

/**
 * @swagger
 * /admin/{id}/activate:
 *   patch:
 *     summary: Activate a user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID to activate
 *     responses:
 *       200:
 *         description: User activated successfully
 *       404:
 *         description: User not found
 */
router.patch('/:id/activate', authMiddleware(['admin']), AdminController.activateUser);

/**
 * @swagger
 * /admin/{id}/suspend:
 *   patch:
 *     summary: Suspend a user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID to suspend
 *     responses:
 *       200:
 *         description: User suspended successfully
 *       404:
 *         description: User not found
 */
router.patch('/:id/suspend', authMiddleware(['admin']), AdminController.suspendUser);

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Delete a user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', authMiddleware(['admin']), AdminController.deleteUser);

module.exports = router;