'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('GiftCards', 'image_id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('GiftCards', 'image_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'GiftCardImages',
        key: 'id'
      }
    });
  }
}; 