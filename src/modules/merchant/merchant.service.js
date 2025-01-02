'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const logger = require('../../utils/logger');

class MerchantService {
  static async login(email, password) {
    try {
      // 查找商家用户
      const merchant = await User.findOne({ 
        where: { 
          email,
          role: 'merchant' 
        } 
      });

      if (!merchant) {
        throw new Error('Invalid email or password');
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, merchant.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // 生成 JWT token
      const token = jwt.sign(
        { 
          id: merchant.id, 
          role: merchant.role, 
          email: merchant.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // 延长 token 有效期
      );

      logger.info('Merchant logged in successfully:', merchant.id);
      return { 
        message: 'Login successful',
        token,
        merchant: {
          id: merchant.id,
          username: merchant.username,
          email: merchant.email,
          role: merchant.role
        }
      };
    } catch (error) {
      logger.error('Merchant login error:', error);
      throw error;
    }
  }
}

module.exports = MerchantService;