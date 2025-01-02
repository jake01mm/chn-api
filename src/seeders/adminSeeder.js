'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const adminData = {
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10),
        role: 'admin',
        email_verified: true,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      };

      await queryInterface.bulkInsert('Users', [adminData], {});
      console.log('Admin account created:', adminData.email);
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {
      role: 'admin'
    }, {});
  }
}; 