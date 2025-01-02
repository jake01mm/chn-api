'use strict';

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

function avatarAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 根据类型验证权限
    switch (req.params.type) {
      case 'user':
        if (decoded.role !== 'user' || decoded.id.toString() !== req.params.id) {
          return res.status(403).json({ error: 'Unauthorized access to user avatar' });
        }
        break;
      case 'merchant':
        if (decoded.role !== 'merchant' || decoded.id.toString() !== req.params.id) {
          return res.status(403).json({ error: 'Unauthorized access to merchant avatar' });
        }
        break;
      case 'admin':
        if (decoded.role !== 'admin' || decoded.id.toString() !== req.params.id) {
          return res.status(403).json({ error: 'Unauthorized access to admin avatar' });
        }
        break;
      default:
        return res.status(400).json({ error: 'Invalid avatar type' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Avatar authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = avatarAuthMiddleware; 