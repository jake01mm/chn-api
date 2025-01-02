// src/middlewares/rateLimiter.js
'use strict';

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 限制每个 IP 100 个请求
  message: 'Too many requests from this IP, please try again later.',
  handler: (req, res) => {
    logger.info(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Too many requests from this IP, please try again later.'
    });
  }
});

module.exports = limiter;