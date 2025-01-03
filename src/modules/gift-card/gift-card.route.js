'use strict';

const express = require('express');
const router = express.Router();
const GiftCardController = require('./gift-card.controller');
const authMiddleware = require('../../middlewares/authMiddleware');
const { singleGiftCardImage } = require('../../utils/gift-card-upload');

/**
 * 礼品卡管理路由
 * 
 * 路由结构：
 * 礼品卡类型管理（管理员）：
 * POST   /gift-cards/types     - 创建礼品卡类型（包含图片）
 * PUT    /gift-cards/types/:id - 更新礼品卡类型（包含图片）
 * DELETE /gift-cards/types/:id - 删除礼品卡类型
 * GET    /gift-cards/types     - 获取所有类型
 * 
 * 礼品卡价格管理：
 * POST   /gift-cards/types/:typeId/cards - 创建礼品卡价格（管理员）
 * PUT    /gift-cards/cards/:id          - 更新礼品卡价格（管理员和商家）
 * DELETE /gift-cards/cards/:id          - 删除礼品卡（管理员）
 * GET    /gift-cards/cards              - 获取礼品卡列表
 */

// 礼品卡类型管理（包含图片）
router.post('/types', authMiddleware(['admin']), singleGiftCardImage, GiftCardController.createType);
router.put('/types/:id', authMiddleware(['admin']), singleGiftCardImage, GiftCardController.updateType);
router.get('/types', GiftCardController.getAllTypes);
router.delete('/types/:id', authMiddleware(['admin']), GiftCardController.deleteType);

// 礼品卡价格管理
router.post('/types/:typeId/cards', authMiddleware(['admin']), GiftCardController.createCard);
router.put('/cards/:id', authMiddleware(['admin', 'merchant']), GiftCardController.updateCard);
router.delete('/cards/:id', authMiddleware(['admin']), GiftCardController.deleteCard);
router.get('/cards', GiftCardController.getAllCards);

module.exports = router; 