'use strict';

const UserService = require('./user.service');
const VerificationService = require('../verification/verification.service');
const logger = require('../../utils/logger');

class UserController {
  /**
   * 用户注册
   */
  static async register(req, res) {
    try {
      const { username,email, password, phone_number } = req.body;
      const result = await UserService.register(username,email, password, phone_number);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 用户登录
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  /**
   * 忘记密码 - 发送验证码
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      logger.debug('Forgot password request for email:', email);
      
      const result = await VerificationService.sendCode(email, 'password_reset');
      res.json(result);
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 重置密码
   */
  static async resetPassword(req, res) {
    try {
      const { email, code, newPassword } = req.body;
      logger.debug('Reset password request for email:', email);

      // 先验证验证码
      await VerificationService.verifyCode(email, code, 'password_reset');
      
      // 更新密码
      const result = await UserService.resetPassword(email, newPassword);
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UserController;