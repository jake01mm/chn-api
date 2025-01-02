'use strict';

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const logger = require('./logger');

// 初始化 Mailgun 客户端
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || 'your-api-key-here',
});

class EmailService {
  /**
   * 发送邮件
   * @param {string} to 接收者邮箱地址
   * @param {string} subject 邮件主题
   * @param {string} text 邮件内容
   * @param {string} html 邮件内容（HTML 格式，可选）
   */
  static async sendEmail(to, subject, text, html = '') {
    // 打印邮件内容到终端
    logger.info('============ Email Content ============');
    logger.info(`To: ${to}`);
    logger.info(`Subject: ${subject}`);
    logger.info('Body:');
    logger.info(text);
    if (html) {
      logger.info('HTML Content:');
      logger.info(html);
    }
    logger.info('====================================');

    // 在开发环境中，可以选择只打印不发送
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_EMAIL_SEND === 'true') {
      logger.info('Email sending skipped in development mode');
      return;
    }

    try {
      const response = await mg.messages.create(
        process.env.MAILGUN_DOMAIN || 'sandbox6aaf0841cca04975bc048e44acc4ca44.mailgun.org',
        {
          from: `CardHubNow <mailgun@${process.env.MAILGUN_DOMAIN}>`,
          to: [to],
          subject,
          text,
          html,
        }
      );
      logger.info('Email sent successfully:', response.id);
      return response;
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * 发送验证码邮件
   * @param {string} to 接收者邮箱
   * @param {string} code 验证码
   * @param {string} type 验证类型
   * @param {Date} expiresAt 过期时间
   */
  static async sendVerificationEmail(to, code, type, expiresAt) {
    const templates = {
      password_reset: {
        subject: 'Password Reset Verification Code - CardHubNow',
        template: `
Dear user,

You have requested to reset your password at CardHubNow.

Your verification code is: ${code}

This code will expire in 5 minutes (at ${expiresAt.toLocaleTimeString()}).

If you didn't request this, please ignore this email or contact our support.

Best regards,
CardHubNow Team
        `
      },
      register: {
        subject: 'Email Verification - CardHubNow',
        template: `
Welcome to CardHubNow!

Your email verification code is: ${code}

This code will expire in 5 minutes (at ${expiresAt.toLocaleTimeString()}).

Best regards,
CardHubNow Team
        `
      },
      Withdrawal: {
        subject: 'Withdrawal Verification Code - CardHubNow',
        template: `
Dear user,

You have requested a withdrawal from your CardHubNow account.

Your verification code is: ${code}

This code will expire in 5 minutes (at ${expiresAt.toLocaleTimeString()}).

If you didn't initiate this withdrawal, please contact our support immediately.

Best regards,
CardHubNow Team
        `
      }
    };

    const emailTemplate = templates[type] || {
      subject: 'Verification Code - CardHubNow',
      template: `
Your verification code is: ${code}

This code will expire in 5 minutes (at ${expiresAt.toLocaleTimeString()}).

Best regards,
CardHubNow Team
      `
    };

    return await this.sendEmail(
      to,
      emailTemplate.subject,
      emailTemplate.template.trim()
    );
  }
}

module.exports = EmailService;