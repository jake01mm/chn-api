'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 先删除旧表（如果存在）
    await queryInterface.dropTable('UserAvatars', { force: true });

    // 创建新表
    await queryInterface.createTable('UserAvatars', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      avatar_url: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      file_path: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '文件在服务器上的物理路径'
      },
      content_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: '文件MIME类型'
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '文件大小（字节）'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {  // 添加软删除字段
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex('UserAvatars', ['user_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserAvatars');
  }
};