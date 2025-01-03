'use strict';

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * 通用权限验证中间件
 * 功能：
 * 1. 验证 JWT token 的有效性
 * 2. 检查用户是否存在且状态正常
 * 3. 验证用户角色权限
 * 
 * 使用场景：
 * - 需要登录才能访问的接口
 * - 需要特定角色权限的接口（如管理员、商家专属接口）
 * 
 * @param {Array} allowedRoles - 允许访问的角色数组，例：['admin', 'merchant']
 */
const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // 1. 获取并验证 token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 2. 检查用户是否存在
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // 3. 检查用户状态
      if (user.status !== 'active') {
        return res.status(403).json({ error: 'Account is not active' });
      }

      // 4. 验证角色权限
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // 5. 将用户信息附加到请求对象
      req.user = user;
      next();
    } catch (error) {
      logger.error('Auth middleware error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};

module.exports = authMiddleware;