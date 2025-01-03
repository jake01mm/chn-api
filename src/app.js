'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./models');
const logger = require('./utils/logger');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
// 路由模块
const userRoutes = require('./modules/user/user.route');
const adminRoutes = require('./modules/admin/admin.route');
const merchantRoutes = require('./modules/merchant/merchant.route');
const verificationRoutes = require('./modules/verification/verification.route');
const avatarRoutes = require('./modules/avatar/avatar.route');
const giftCardRoutes = require('./modules/gift-card/gift-card.route');
const sensitiveInfoRoutes = require('./modules/sensitive-info/sensitive-info.route');

// 中间件
const rateLimiter = require('./middlewares/rateLimiter');


const app = express();

// 基础中间件
app.use(helmet({
  contentSecurityPolicy: false,  // 禁用 CSP
  crossOriginEmbedderPolicy: false  // 允许跨域嵌入
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger 配置
try {
  logger.debug('Setting up Swagger UI...');
  const swaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showCommonExtensions: true
    }
  };
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
  logger.info('Swagger UI setup completed');
} catch (error) {
  logger.error('Failed to setup Swagger UI:', error);
}

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API 路由
app.use('/user', rateLimiter, userRoutes); // 用户模块路由
app.use('/admin', adminRoutes); // 管理员模块路由
app.use('/merchant', merchantRoutes); // 商家模块路由
app.use('/verifications', verificationRoutes); // 验证模块路由
app.use('/avatar', avatarRoutes);  // 添加头像路由
app.use('/gift-cards', giftCardRoutes);
app.use('/sensitive-info', sensitiveInfoRoutes);


// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CHN API' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('Error:', err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = { app, db };
