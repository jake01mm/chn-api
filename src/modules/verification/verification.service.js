'use strict';

const { Op } = require('sequelize');
const db = require('../../models');
const EmailService = require('../../utils/emailService');
const crypto = require('crypto');
const logger = require('../../utils/logger');

class VerificationService {
  /**
   * 发送验证码
   * @param {string} email - 用户邮箱
   * @param {string} type - 验证码类型
   */
  static async sendCode(email, type) {
    try {
      logger.info(`Sending ${type} verification code to ${email}`);

      // 检查用户是否存在
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        logger.error(`User not found for email: ${email}`);
        throw new Error('User not found.');
      }

      // 检查是否已发送验证码且未过期
      const existingCode = await db.VerificationCode.findOne({
        where: {
          user_id: user.id,
          type,
          expires_at: { [Op.gt]: new Date() },
        },
      });

      if (existingCode) {
        logger.warn(`Active verification code exists for ${email}`);
        throw new Error('A verification code has already been sent. Please try again later.');
      }

      // 生成6位数验证码
      const code = crypto.randomInt(100000, 999999).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟有效期

      // 保存验证码
      await db.VerificationCode.create({
        user_id: user.id,
        code,
        type,
        expires_at: expiresAt,
      });

      // 发送验证码邮件
      await EmailService.sendVerificationEmail(email, code, type, expiresAt);

      logger.info(`Verification code sent successfully to ${email}`);
      logger.debug(`Code details: ${code}, Type: ${type}, Expires: ${expiresAt}`);

      return { 
        message: 'Verification code sent successfully',
        expires_at: expiresAt
      };
    } catch (error) {
      logger.error('Error sending verification code:', error);
      throw error;
    }
  }

  /**
   * 验证验证码
   * @param {string} email - 用户邮箱
   * @param {string} code - 验证码
   * @param {string} type - 验证码类型
   */
  static async verifyCode(email, code, type) {
    try {
      logger.info(`Verifying ${type} code for ${email}`);

      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        logger.error(`User not found for email: ${email}`);
        throw new Error('User not found');
      }

      const verification = await db.VerificationCode.findOne({
        where: {
          user_id: user.id,
          code,
          type,
          expires_at: { [Op.gt]: new Date() },
        },
      });

      if (!verification) {
        logger.error(`Invalid or expired code for ${email}`);
        throw new Error('Invalid or expired verification code');
      }

      // 验证成功后删除验证码
      await verification.destroy();
      
      logger.info(`Code verified successfully for ${email}`);
      return { message: 'Code verified successfully' };
    } catch (error) {
      logger.error('Error verifying code:', error);
      throw error;
    }
  }
}

module.exports = VerificationService;