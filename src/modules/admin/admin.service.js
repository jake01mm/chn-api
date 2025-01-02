const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
require('dotenv').config();
const logger = require('../../utils/logger');

class AdminService {
  /**
   * 管理员登录
   */
  static async login(email, password) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { role: 'admin', email: adminEmail },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { message: 'Login successful', token };
  }

  /**
   * 创建商家账户
   */
  static async createMerchant(email, password, username, phone_number) {
    try {
      // 添加日志来查看接收到的参数
      logger.debug('Creating merchant with params:', { email, username, phone_number });

      // 检查是否已存在商家账户
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email is already registered');
      }

      // 检查是否提供必填字段
      if (!phone_number) {
        logger.error('Phone number missing in request');
        throw new Error('Phone number is required');
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建商家账户
      const merchant = await User.create({
        email,
        password: hashedPassword,
        username,
        phone_number,
        role: 'merchant',
        email_verified: true
      });

      logger.info('Merchant created successfully:', merchant.id);
      return {
        message: 'Merchant account created successfully',
        merchant: {
          id: merchant.id,
          username: merchant.username,
          email: merchant.email,
          phone_number: merchant.phone_number,
          role: merchant.role,
        },
      };
    } catch (error) {
      logger.error('Error creating merchant:', error);
      throw error;
    }
  }

  /**
   * 更新用户账户状态
   */
  static async updateUserStatus(userId, status) {
    const user = await User.findByPk(userId); // 使用主键查询用户
    if (!user) {
      throw new Error('User not found');
    }
  
    user.status = status; // 更新状态字段
    await user.save(); // 保存更新
  
    return user; // 返回更新后的用户
  }

  /**
   * 删除用户账户
   */
  static async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();
    return { message: 'User account deleted successfully' };
  }
}

module.exports = AdminService;