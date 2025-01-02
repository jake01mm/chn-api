'use strict';

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error('No authorization header');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logger.debug('Decoded token:', decoded);

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        throw new Error('Unauthorized role');
      }

      req.user = decoded;
      next();
    } catch (error) {
      logger.error('Auth error:', error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

module.exports = authMiddleware;