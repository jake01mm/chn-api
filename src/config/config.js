'use strict';

const path = require('path');
const logger = require('../utils/logger');

// 加载环境变量
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// 只在开发环境打印环境变量路径
if (process.env.NODE_ENV === 'development') {
  logger.debug('ENV file path:', path.resolve(__dirname, '../../.env'));
}

const defaultConfig = {
  dialect: 'mysql',
  timezone: '+08:00',
  define: {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: logger.db // 使用自定义日志函数
};

// 只在开发环境打印数据库配置
if (process.env.NODE_ENV === 'development') {
  logger.debug('Database Configuration:', {
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  });
}

module.exports = {
  development: {
    ...defaultConfig,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
  test: {
    ...defaultConfig,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TEST_NAME || 'chn_api_test',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
  production: {
    ...defaultConfig,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false // 生产环境禁用日志
  }
};