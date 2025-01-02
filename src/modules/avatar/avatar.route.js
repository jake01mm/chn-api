'use strict';

const express = require('express');
const AvatarController = require('./avatar.controller');
const { singleFileUpload } = require('../../utils/upload');
const avatarAuthMiddleware = require('../../middlewares/avatarAuthMiddleware');

const router = express.Router();

/**
 * 头像管理路由
 * 
 * 路由结构：
 * POST   /avatar/:type/:id  - 上传或更新头像（需要认证）
 * GET    /avatar/:type/:id  - 获取头像信息（元数据）
 * GET    /avatar/view/:type/:id - 直接查看头像图片
 * DELETE /avatar/:type/:id  - 删除头像（需要认证）
 * 
 * 参数说明：
 * :type - 用户类型，可选值：user/merchant/admin
 * :id   - 用户ID
 * 
 * 权限控制：
 * - 上传和删除操作需要认证，且只能操作自己的头像
 * - 查看头像信息和图片是公开的，无需认证
 */

/**
 * @swagger
 * tags:
 *   name: Avatar
 *   description: 头像管理接口
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Avatar:
 *       type: object
 *       properties:
 *         avatar_url:
 *           type: string
 *           description: 头像访问URL
 *         content_type:
 *           type: string
 *           description: 文件MIME类型
 *         file_size:
 *           type: integer
 *           description: 文件大小（字节）
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /avatar/{type}/{id}:
 *   post:
 *     summary: 上传或更新头像
 *     description: 上传新头像或更新现有头像（需要认证，只能操作自己的头像）
 *     tags: [Avatar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [user, merchant, admin]
 *         description: 用户类型
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: 头像图片文件
 *     responses:
 *       200:
 *         description: 头像上传成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 avatar_url:
 *                   type: string
 *                 content_type:
 *                   type: string
 *                 file_size:
 *                   type: integer
 */
router.post('/:type/:id', avatarAuthMiddleware, singleFileUpload, AvatarController.update);

/**
 * @swagger
 * /avatar/{type}/{id}:
 *   get:
 *     summary: 获取头像信息
 *     description: 获取头像的元数据信息（URL、类型、大小等）
 *     tags: [Avatar]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [user, merchant, admin]
 *         description: 用户类型
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 头像信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avatar'
 */
router.get('/:type/:id', AvatarController.get);

/**
 * @swagger
 * /avatar/view/{type}/{id}:
 *   get:
 *     summary: 直接查看头像图片
 *     description: 直接返回头像图片文件，适合在<img>标签中使用
 *     tags: [Avatar]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [user, merchant, admin]
 *         description: 用户类型
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 头像图片文件
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: 头像不存在，将返回默认头像
 */
router.get('/view/:type/:id', AvatarController.view);

/**
 * @swagger
 * /avatar/{type}/{id}:
 *   delete:
 *     summary: 删除头像
 *     description: 删除用户头像（需要认证，只能删除自己的头像）
 *     tags: [Avatar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [user, merchant, admin]
 *         description: 用户类型
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 头像删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/:type/:id', avatarAuthMiddleware, AvatarController.delete);

module.exports = router; 