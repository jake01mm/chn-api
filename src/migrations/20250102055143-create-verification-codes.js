'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('VerificationCodes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      code: {
        type: Sequelize.STRING(6),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('Withdrawal', 'password_reset', 'register'),
        allowNull: false
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // 添加组合索引
    await queryInterface.addIndex('VerificationCodes', ['user_id', 'type']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('VerificationCodes');
  }
};