'use strict';

const AvatarService = require('./avatar.service');
const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs');

class AvatarController {
  /**
   * 上传/更新头像
   */
  static async update(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: '请选择要上传的图片' });
      }
      const result = await AvatarService.update(req.params.type, req.params.id, req.file);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Avatar update error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 获取头像
   */
  static async get(req, res) {
    try {
      const result = await AvatarService.get(req.params.type, req.params.id);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Get avatar error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 删除头像
   */
  static async delete(req, res) {
    try {
      const result = await AvatarService.delete(req.params.type, req.params.id);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Delete avatar error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 直接查看头像图片
   */
  static async view(req, res) {
    try {
      const avatar = await AvatarService.get(req.params.type, req.params.id);
      
      if (!avatar || !avatar.avatar_url) {
        // 返回默认头像
        const defaultAvatarPath = path.join(__dirname, '../../../public/default-avatar.png');
        if (fs.existsSync(defaultAvatarPath)) {
          return res.sendFile(defaultAvatarPath);
        }
        return res.status(404).json({ error: 'Avatar not found' });
      }

      // 检查文件是否存在
      if (!fs.existsSync(avatar.file_path)) {
        return res.status(404).json({ error: 'Avatar file not found' });
      }

      // 设置正确的Content-Type
      res.set('Content-Type', avatar.content_type);
      
      // 发送文件
      res.sendFile(avatar.file_path);
    } catch (error) {
      logger.error('View avatar error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AvatarController; 