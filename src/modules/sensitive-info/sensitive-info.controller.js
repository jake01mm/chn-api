'use strict';

const SensitiveInfoService = require('./sensitive-info.service');
const logger = require('../../utils/logger');

class SensitiveInfoController {
  /**
   * 获取自己的敏感信息
   */
  static async getMyInfo(req, res) {
    try {
      const info = await SensitiveInfoService.getInfoByUserId(req.user.id);
      res.json(info);
    } catch (error) {
      logger.error('Get my sensitive info error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 更新自己的敏感信息
   */
  static async updateMyInfo(req, res) {
    try {
      const info = await SensitiveInfoService.updateInfo(req.user.id, req.body);
      res.json(info);
    } catch (error) {
      logger.error('Update my sensitive info error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 获取指定用户的敏感信息（商家/管理员权限）
   */
  static async getUserInfo(req, res) {
    try {
      const info = await SensitiveInfoService.getInfoByUserId(req.params.id, req.user);
      res.json(info);
    } catch (error) {
      logger.error('Get user sensitive info error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 获取所有用户的敏感信息（管理员权限）
   */
  static async getAllUsersInfo(req, res) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const infos = await SensitiveInfoService.getAllInfo(page, limit, filters);
      res.json(infos);
    } catch (error) {
      logger.error('Get all sensitive info error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 更新商家的敏感信息（管理员权限）
   */
  static async updateMerchantInfo(req, res) {
    try {
      const info = await SensitiveInfoService.updateMerchantInfo(req.params.id, req.body);
      res.json(info);
    } catch (error) {
      logger.error('Update merchant sensitive info error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 审核敏感信息（管理员权限）
   */
  static async approveInfo(req, res) {
    try {
      const info = await SensitiveInfoService.approveInfo(
        req.params.id,
        req.body.is_approved,
        req.body.reason
      );
      res.json(info);
    } catch (error) {
      logger.error('Approve sensitive info error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = SensitiveInfoController; 