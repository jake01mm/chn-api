'use strict';

const { app, db } = require('./app');
const logger = require('./utils/logger');
const createAdmin = require('./seeders/adminSeeder');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 测试数据库连接
    await db.sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // 不再使用 sync，改为使用迁移
    // if (process.env.NODE_ENV === 'development') {
    //   await db.sequelize.sync({ force: true });
    //   logger.info('Database synced successfully');
    //   await createAdmin();
    // }

    // 启动服务器
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  db.sequelize.close().then(() => {
    logger.info('Database connection closed.');
    process.exit(0);
  });
});
