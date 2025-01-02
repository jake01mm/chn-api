'use strict';

const AdminService = require('./admin.service');
const logger = require('../../utils/logger');

class AdminController {
  /**
   * 管理员登录
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AdminService.login(email, password);
      res.json(result);
    } catch (error) {
      logger.error('Login error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 创建商家账户
   */
  static async createMerchant(req, res) {
    try {
      const { email, password, username, phone_number } = req.body;
      logger.debug('Creating merchant:', { email, username, phone_number });
      
      const result = await AdminService.createMerchant(
        email,
        password,
        username,
        phone_number
      );
      res.json(result);
    } catch (error) {
      logger.error('Create merchant error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 激活用户账户
   */
  static async activateUser(req, res) {
    try {
      const userId = req.params.id;
      const result = await AdminService.updateUserStatus(userId, 'active');
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 暂停用户账户
   */
  static async suspendUser(req, res) {
    try {
      const userId = req.params.id; // 获取 URL 中的用户 ID
      const result = await AdminService.updateUserStatus(userId, 'suspended'); // 调用服务更新状态
      res.status(200).json({ message: 'User account suspended successfully', user: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 删除用户账户
   */
  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const result = await AdminService.deleteUser(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AdminController;