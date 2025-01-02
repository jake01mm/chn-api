'use strict';

const { UserAvatar } = require('../../models');
const { deleteFile } = require('../../utils/upload');
const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs');

class AvatarService {
  /**
   * 更新用户头像
   */
  static async update(type, id, file) {
    try {
      // 构建访问URL
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const avatarUrl = `${baseUrl}/uploads/avatars/${type}/${id}/${file.filename}`;

      // 更新或创建数据库记录
      const [avatar, created] = await UserAvatar.findOrCreate({
        where: { 
          user_id: id,
          user_type: type  // 添加用户类型字段
        },
        defaults: {
          avatar_url: avatarUrl,
          file_path: file.path,
          content_type: file.mimetype,
          file_size: file.size
        }
      });

      if (!created) {
        await avatar.update({
          avatar_url: avatarUrl,
          file_path: file.path,
          content_type: file.mimetype,
          file_size: file.size
        });
      }

      return {
        message: 'Avatar updated successfully',
        avatar_url: avatarUrl,
        content_type: file.mimetype,
        file_size: file.size
      };
    } catch (error) {
      logger.error('Update avatar error:', error);
      throw error;
    }
  }

  /**
   * 获取头像
   */
  static async get(type, id) {
    try {
      const avatar = await UserAvatar.findOne({
        where: { 
          user_id: id,
          user_type: type
        },
        attributes: ['avatar_url', 'content_type', 'file_size', 'created_at', 'updated_at']
      });

      if (!avatar) {
        return { avatar_url: null };
      }

      return avatar;
    } catch (error) {
      logger.error('Get avatar error:', error);
      throw error;
    }
  }

  /**
   * 删除头像
   */
  static async delete(type, id) {
    try {
      const avatar = await UserAvatar.findOne({
        where: { 
          user_id: id,
          user_type: type
        }
      });

      if (!avatar) {
        throw new Error('Avatar not found');
      }

      // 删除物理文件
      if (fs.existsSync(avatar.file_path)) {
        await deleteFile(avatar.file_path);
      }

      // 删除数据库记录
      await avatar.destroy();

      return { message: 'Avatar deleted successfully' };
    } catch (error) {
      logger.error('Delete avatar error:', error);
      throw error;
    }
  }
}

module.exports = AvatarService;