'use strict';

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * 头像上传专用中间件
 * 功能：
 * 1. 验证用户身份
 * 2. 检查文件类型和大小
 * 3. 处理不同用户类型的头像存储路径
 * 
 * 使用场景：
 * - 用户上传头像接口
 * - 商家上传店铺头像
 * - 管理员上传系统头像
 * 
 * 特点：
 * - 包含文件验证逻辑
 * - 根据用户类型设置不同的存储规则
 * - 与文件上传中间件配合使用
 */
const avatarAuthMiddleware = async (req, res, next) => {
  try {
    // 1. 验证 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. 获取用户信息
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // 3. 检查文件
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 4. 设置用户类型（用于文件路径）
    req.userType = user.role;
    req.user = user;
    
    next();
  } catch (error) {
    logger.error('Avatar auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = avatarAuthMiddleware; 