'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. 给 GiftCardTypes 添加 image_url 字段
    await queryInterface.addColumn('GiftCardTypes', 'image_url', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'note'  // 在 note 字段后添加
    });

    // 2. 从 GiftCards 表中移除 image_id 字段
    await queryInterface.removeColumn('GiftCards', 'image_id');

    // 3. 删除 GiftCardImages 表（因为不再需要）
    await queryInterface.dropTable('GiftCardImages');
  },

  async down(queryInterface, Sequelize) {
    // 1. 重新创建 GiftCardImages 表
    await queryInterface.createTable('GiftCardImages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      image_url: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // 2. 重新添加 image_id 字段到 GiftCards 表
    await queryInterface.addColumn('GiftCards', 'image_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'GiftCardImages',
        key: 'id'
      }
    });

    // 3. 移除 GiftCardTypes 的 image_url 字段
    await queryInterface.removeColumn('GiftCardTypes', 'image_url');
  }
}; 