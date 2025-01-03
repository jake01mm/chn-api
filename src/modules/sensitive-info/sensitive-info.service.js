'use strict';

const { User, UserSensitiveInfo } = require('../../models');
const logger = require('../../utils/logger');
const { Op } = require('sequelize');

class SensitiveInfoService {
  /**
   * 获取用户敏感信息
   */
  static async getInfoByUserId(userId, requestUser = null) {
    const info = await UserSensitiveInfo.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'role']
        }
      ]
    });

    if (!info) {
      throw new Error('Sensitive information not found');
    }

    // 如果是商家查询，确保只能查看用户信息
    if (requestUser && requestUser.role === 'merchant' && info.user.role !== 'user') {
      throw new Error('Merchants can only view user information');
    }

    return info;
  }

  /**
   * 更新敏感信息
   */
  static async updateInfo(userId, data) {
    const [info] = await UserSensitiveInfo.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
        ...data,
        is_approved: false // 新建或更新时重置审核状态
      }
    });

    if (info) {
      await info.update({
        ...data,
        is_approved: false // 更新时重置审核状态
      });
    }

    return info;
  }

  /**
   * 获取所有敏感信息（支持分页和筛选）
   */
  static async getAllInfo(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    // 构建筛选条件
    if (filters.is_approved !== undefined) {
      where.is_approved = filters.is_approved;
    }

    if (filters.role) {
      where['$user.role$'] = filters.role;
    }

    const { count, rows } = await UserSensitiveInfo.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'role']
        }
      ],
      offset,
      limit,
      order: [['updated_at', 'DESC']]
    });

    return {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows
    };
  }

  /**
   * 更新商家敏感信息（管理员权限）
   */
  static async updateMerchantInfo(merchantId, data) {
    const merchant = await User.findOne({
      where: { id: merchantId, role: 'merchant' }
    });

    if (!merchant) {
      throw new Error('Merchant not found');
    }

    const [info] = await UserSensitiveInfo.findOrCreate({
      where: { user_id: merchantId },
      defaults: {
        user_id: merchantId,
        ...data
      }
    });

    if (info) {
      await info.update(data);
    }

    return info;
  }

  /**
   * 审核敏感信息
   */
  static async approveInfo(infoId, isApproved, reason) {
    const info = await UserSensitiveInfo.findByPk(infoId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'role']
        }
      ]
    });

    if (!info) {
      throw new Error('Sensitive information not found');
    }

    await info.update({
      is_approved: isApproved
    });

    // TODO: 可以在这里添加审核日志记录
    logger.info(`Sensitive info ${infoId} ${isApproved ? 'approved' : 'rejected'}: ${reason}`);

    return info;
  }
}

module.exports = SensitiveInfoService; 