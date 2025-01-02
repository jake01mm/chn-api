'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../../models');
require('dotenv').config();
const logger = require('../../utils/logger');

class UserService {
  /**
   * 用户注册
   */
  static async register(username, email, password, phone_number) {
    // 检查是否已存在用户
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户记录
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone_number, // 直接存储到 users 表
    });

    return { 
      message: 'User registered successfully', 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
      }
    };
  }

  /**
   * 用户登录
   */
  static async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // 检查邮箱是否已验证
    if (!user.email_verified) {
      throw new Error('Email not verified. Please verify your email or contact support.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { message: 'Login successful', token };
  }

  /**
   * 重置用户密码
   */
  static async resetPassword(email, newPassword) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      // 加密新密码
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // 更新密码
      await user.update({ password: hashedPassword });
      
      logger.info('Password reset successfully for user:', user.id);
      return { message: 'Password reset successfully' };
    } catch (error) {
      logger.error('Reset password error:', error);
      throw error;
    }
  }
}

module.exports = UserService;