'use strict';

const express = require('express');
const router = express.Router();
const SensitiveInfoController = require('./sensitive-info.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validateMiddleware');
const { sensitiveInfoValidator } = require('./sensitive-info.validator');

/**
 * @swagger
 * tags:
 *   name: Sensitive Info
 *   description: 用户敏感信息管理
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SensitiveInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 敏感信息ID
 *         user_id:
 *           type: integer
 *           description: 用户ID
 *         first_name:
 *           type: string
 *           description: 名字
 *         last_name:
 *           type: string
 *           description: 姓氏
 *         bank_name:
 *           type: string
 *           description: 银行名称
 *         bank_account:
 *           type: string
 *           description: 银行账号
 *         is_approved:
 *           type: boolean
 *           description: 是否已审核
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /sensitive-info/me:
 *   get:
 *     summary: 获取自己的敏感信息
 *     tags: [Sensitive Info]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取敏感信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensitiveInfo'
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 */
router.get(
  '/me',
  authMiddleware(['user', 'merchant']),
  SensitiveInfoController.getMyInfo
);

/**
 * @swagger
 * /sensitive-info/me:
 *   put:
 *     summary: 更新自己的敏感信息
 *     tags: [Sensitive Info]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               last_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               bank_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               bank_account:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *     responses:
 *       200:
 *         description: 成功更新敏感信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensitiveInfo'
 *       400:
 *         description: 输入数据验证失败
 *       401:
 *         description: 未授权
 */
router.put(
  '/me',
  authMiddleware(['user', 'merchant']),
  validate(sensitiveInfoValidator.updateInfo),
  SensitiveInfoController.updateMyInfo
);

/**
 * @swagger
 * /sensitive-info/users/{id}:
 *   get:
 *     summary: 获取指定用户的敏感信息（商家/管理员权限）
 *     tags: [Sensitive Info]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功获取用户敏感信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensitiveInfo'
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 */
router.get(
  '/users/:id',
  authMiddleware(['merchant', 'admin']),
  SensitiveInfoController.getUserInfo
);

/**
 * @swagger
 * /sensitive-info/users:
 *   get:
 *     summary: 获取所有用户的敏感信息（管理员权限）
 *     tags: [Sensitive Info]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: is_approved
 *         schema:
 *           type: boolean
 *         description: 审核状态过滤
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, merchant]
 *         description: 用户角色过滤
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SensitiveInfo'
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 */
router.get(
  '/users',
  authMiddleware(['admin']),
  SensitiveInfoController.getAllUsersInfo
);

/**
 * @swagger
 * /sensitive-info/merchants/{id}:
 *   put:
 *     summary: 更新商家的敏感信息（管理员权限）
 *     tags: [Sensitive Info]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 商家ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensitiveInfo'
 *     responses:
 *       200:
 *         description: 成功更新商家信息
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 */
router.put(
  '/merchants/:id',
  authMiddleware(['admin']),
  validate(sensitiveInfoValidator.updateInfo),
  SensitiveInfoController.updateMerchantInfo
);

/**
 * @swagger
 * /sensitive-info/approve/{id}:
 *   put:
 *     summary: 审核敏感信息（管理员权限）
 *     tags: [Sensitive Info]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 敏感信息ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_approved
 *             properties:
 *               is_approved:
 *                 type: boolean
 *                 description: 审核结果
 *               reason:
 *                 type: string
 *                 maxLength: 500
 *                 description: 审核原因
 *     responses:
 *       200:
 *         description: 审核成功
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 */
router.put(
  '/approve/:id',
  authMiddleware(['admin']),
  validate(sensitiveInfoValidator.approve),
  SensitiveInfoController.approveInfo
);

module.exports = router; 