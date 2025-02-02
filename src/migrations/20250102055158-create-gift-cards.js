'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('GiftCards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'GiftCardTypes',
          key: 'id'
        }
      },
      country: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      min: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      max: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      nairarate: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00
      },
      image_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'GiftCardImages',
          key: 'id'
        }
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
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('GiftCards');
  }
};