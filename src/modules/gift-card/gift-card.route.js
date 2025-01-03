'use strict';

const express = require('express');
const router = express.Router();
const GiftCardController = require('./gift-card.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validateMiddleware');
const { giftCardValidator } = require('./gift-card.validator');
const upload = require('../../utils/gift-card-upload');

/**
 * @swagger
 * tags:
 *   name: Gift Cards
 *   description: 礼品卡管理
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GiftCardType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 类型ID
 *         name:
 *           type: string
 *           description: 礼品卡名称
 *         note:
 *           type: string
 *           description: 描述信息
 *         image_url:
 *           type: string
 *           description: 图片URL
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     GiftCard:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 价格ID
 *         type_id:
 *           type: integer
 *           description: 类型ID
 *         country:
 *           type: string
 *           description: 国家代码
 *         min:
 *           type: number
 *           format: float
 *           description: 最小面值
 *         max:
 *           type: number
 *           format: float
 *           description: 最大面值
 *         nairarate:
 *           type: number
 *           format: float
 *           description: 奈拉汇率
 */

/**
 * @swagger
 * /gift-cards/types:
 *   post:
 *     summary: 创建礼品卡类型
 *     tags: [Gift Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: 礼品卡名称
 *               note:
 *                 type: string
 *                 description: 描述信息
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 礼品卡图片
 *     responses:
 *       201:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GiftCardType'
 */
router.post(
  '/types',
  authMiddleware(['admin']),
  upload.single('image'),
  validate(giftCardValidator.createType),
  GiftCardController.createType
);

/**
 * @swagger
 * /gift-cards/types/{id}:
 *   put:
 *     summary: 更新礼品卡类型
 *     tags: [Gift Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               note:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GiftCardType'
 */
router.put(
  '/types/:id',
  authMiddleware(['admin']),
  upload.single('image'),
  validate(giftCardValidator.updateType),
  GiftCardController.updateType
);

/**
 * @swagger
 * /gift-cards/types/{id}:
 *   delete:
 *     summary: 删除礼品卡类型
 *     tags: [Gift Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 删除成功
 */
router.delete(
  '/types/:id',
  authMiddleware(['admin']),
  GiftCardController.deleteType
);

/**
 * @swagger
 * /gift-cards/types:
 *   get:
 *     summary: 获取所有礼品卡类型
 *     tags: [Gift Cards]
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GiftCardType'
 */
router.get('/types', GiftCardController.getAllTypes);

/**
 * @swagger
 * /gift-cards/types/{typeId}/cards:
 *   post:
 *     summary: 创建礼品卡价格
 *     tags: [Gift Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: typeId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country
 *               - min
 *               - max
 *               - nairarate
 *             properties:
 *               country:
 *                 type: string
 *               min:
 *                 type: number
 *               max:
 *                 type: number
 *               nairarate:
 *                 type: number
 *     responses:
 *       201:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GiftCard'
 */
router.post(
  '/types/:typeId/cards',
  authMiddleware(['admin']),
  validate(giftCardValidator.createCard),
  GiftCardController.createCard
);

/**
 * @swagger
 * /gift-cards/cards/{id}:
 *   put:
 *     summary: 更新礼品卡价格
 *     tags: [Gift Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *               min:
 *                 type: number
 *               max:
 *                 type: number
 *               nairarate:
 *                 type: number
 *     responses:
 *       200:
 *         description: 更新成功
 */
router.put(
  '/cards/:id',
  authMiddleware(['admin', 'merchant']),
  validate(giftCardValidator.updateCard),
  GiftCardController.updateCard
);

/**
 * @swagger
 * /gift-cards/cards/{id}:
 *   delete:
 *     summary: 删除礼品卡价格
 *     tags: [Gift Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 删除成功
 */
router.delete(
  '/cards/:id',
  authMiddleware(['admin']),
  GiftCardController.deleteCard
);

/**
 * @swagger
 * /gift-cards/cards:
 *   get:
 *     summary: 获取礼品卡价格列表
 *     tags: [Gift Cards]
 *     parameters:
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 按类型筛选
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: 按国家筛选
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GiftCard'
 */
router.get('/cards', GiftCardController.getAllCards);

module.exports = router; 