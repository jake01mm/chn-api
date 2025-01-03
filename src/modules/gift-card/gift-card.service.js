'use strict';

const { GiftCardType, GiftCardImage, GiftCard } = require('../../models');
const { deleteFile } = require('../../utils/gift-card-upload');
const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs').promises;
const sequelize = require('../../models').sequelize;
const { Op } = require('sequelize');

class GiftCardService {
  /**
   * 礼品卡类型管理
   */
  static async createType(data) {
    const { name, note } = data;
    return await GiftCardType.create({
      name,
      note
    });
  }

  static async updateType(id, data) {
    const type = await GiftCardType.findByPk(id);
    if (!type) {
      throw new Error('Gift card type not found');
    }
    return await type.update(data);
  }

  static async deleteType(id) {
    // 使用事务确保所有操作的原子性
    const transaction = await sequelize.transaction();

    try {
      const type = await GiftCardType.findByPk(id);
      if (!type) {
        throw new Error('Gift card type not found');
      }

      // 如果有图片，准备删除图片文件
      if (type.image_url) {
        const filename = path.basename(type.image_url);
        const filePath = path.join(__dirname, '../../../uploads/gift-cards', filename);
        try {
          await deleteFile(filePath);
        } catch (error) {
          logger.error('Delete type image file error:', error);
          // 继续执行，不因为图片删除失败而中断整个操作
        }
      }

      // 删除所有关联的价格信息
      await GiftCard.destroy({
        where: { type_id: id },
        force: true, // 强制物理删除
        transaction
      });

      // 删除类型本身
      await type.destroy({
        force: true, // 强制物理删除
        transaction
      });

      // 提交事务
      await transaction.commit();

      return { message: 'Gift card type and all related data deleted successfully' };
    } catch (error) {
      // 如果出现错误，回滚所有数据库操作
      await transaction.rollback();
      throw error;
    }
  }

  static async getAllTypes() {
    return await GiftCardType.findAll({
      order: [['name', 'ASC']]
    });
  }

  /**
   * 礼品卡图片管理
   */
  static async uploadImage(file) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const imageUrl = `${baseUrl}/uploads/gift-cards/${file.filename}`;

    return await GiftCardImage.create({
      image_url: imageUrl
    });
  }

  static async deleteImage(id) {
    // 使用事务确保操作的原子性
    const transaction = await sequelize.transaction();

    try {
      const image = await GiftCardImage.findByPk(id);
      if (!image) {
        throw new Error('Gift card image not found');
      }

      // 检查是否有关联的礼品卡
      const hasGiftCards = await GiftCard.count({ 
        where: { image_id: id },
        transaction 
      });
      
      if (hasGiftCards) {
        throw new Error('Cannot delete image that is in use');
      }

      // 删除物理文件
      const filename = path.basename(image.image_url);
      const filePath = path.join(__dirname, '../../../uploads/gift-cards', filename);
      
      // 先删除数据库记录
      await image.destroy({ 
        force: true,  // 强制删除（即使是软删除也会真实删除）
        transaction 
      });

      // 再删除物理文件
      await deleteFile(filePath);

      // 提交事务
      await transaction.commit();
    } catch (error) {
      // 如果出错，回滚事务
      await transaction.rollback();
      throw error;
    }
  }

  static async getAllImages() {
    return await GiftCardImage.findAll({
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * 礼品卡管理
   */
  static async create(data) {
    const { type_id, country, min, max, nairarate, image_id } = data;

    // 验证类型是否存在
    const type = await GiftCardType.findByPk(type_id);
    if (!type) {
      throw new Error('Invalid gift card type');
    }

    // 验证图片是否存在（如果提供）
    if (image_id) {
      const image = await GiftCardImage.findByPk(image_id);
      if (!image) {
        throw new Error('Invalid image');
      }
    }

    return await GiftCard.create({
      type_id,
      country,
      min,
      max,
      nairarate,
      image_id
    });
  }

  static async update(id, data) {
    const giftCard = await GiftCard.findByPk(id);
    if (!giftCard) {
      throw new Error('Gift card not found');
    }

    // 如果更新类型，验证新类型是否存在
    if (data.type_id) {
      const type = await GiftCardType.findByPk(data.type_id);
      if (!type) {
        throw new Error('Invalid gift card type');
      }
    }

    // 如果更新图片，验证新图片是否存在
    if (data.image_id) {
      const image = await GiftCardImage.findByPk(data.image_id);
      if (!image) {
        throw new Error('Invalid image');
      }
    }

    return await giftCard.update(data);
  }

  static async updatePrice(id, data, user) {
    const giftCard = await GiftCard.findByPk(id);
    if (!giftCard) {
      throw new Error('Gift card not found');
    }

    const { nairarate } = data;
    if (nairarate === undefined) {
      throw new Error('Naira rate is required');
    }

    // 记录价格更新历史（如果需要的话）
    // await PriceHistory.create({
    //   gift_card_id: id,
    //   old_rate: giftCard.nairarate,
    //   new_rate: nairarate,
    //   updated_by: user.id
    // });

    return await giftCard.update({ nairarate });
  }

  static async delete(id) {
    const giftCard = await GiftCard.findByPk(id);
    if (!giftCard) {
      throw new Error('Gift card not found');
    }
    await giftCard.destroy();
  }

  static async getAll(query = {}) {
    const { type_id, country } = query;
    const where = {};

    if (type_id) {
      where.type_id = type_id;
    }
    if (country) {
      where.country = country;
    }

    return await GiftCard.findAll({
      where,
      include: [
        {
          model: GiftCardType,
          as: 'type'
        },
        {
          model: GiftCardImage,
          as: 'image'
        }
      ],
      order: [['type_id', 'ASC'], ['country', 'ASC']]
    });
  }

  /**
   * 礼品卡价格管理
   */
  static async createCard(data) {
    // 验证类型是否存在
    const type = await GiftCardType.findByPk(data.type_id);
    if (!type) {
      throw new Error('Gift card type not found');
    }

    // 验证同一类型下是否已存在相同国家的价格信息
    const existingCard = await GiftCard.findOne({
      where: {
        type_id: data.type_id,
        country: data.country
      }
    });

    if (existingCard) {
      throw new Error('Price for this country already exists under this type');
    }

    // 创建价格信息（移除 image_id）
    return await GiftCard.create({
      type_id: data.type_id,
      country: data.country,
      min: data.min,
      max: data.max,
      nairarate: data.nairarate
    });
  }

  static async updateCard(id, data) {
    const card = await GiftCard.findByPk(id);
    if (!card) {
      throw new Error('Gift card not found');
    }

    // 如果要更改国家，需要检查是否会与同类型下的其他记录冲突
    if (data.country && data.country !== card.country) {
      const existingCard = await GiftCard.findOne({
        where: {
          type_id: card.type_id,
          country: data.country,
          id: { [Op.ne]: id }  // 排除当前记录
        }
      });

      if (existingCard) {
        throw new Error('Price for this country already exists under this type');
      }
    }

    return await card.update(data);
  }

  static async deleteCard(id) {
    const card = await GiftCard.findByPk(id);
    if (!card) {
      throw new Error('Gift card not found');
    }
    await card.destroy();
  }

  static async getAllCards(query = {}) {
    const { type_id, country } = query;
    const where = {};

    if (type_id) {
      where.type_id = type_id;
    }
    if (country) {
      where.country = country;
    }

    return await GiftCard.findAll({
      where,
      include: [
        {
          model: GiftCardType,
          as: 'type',
          attributes: ['id', 'name', 'note', 'image_url']
        }
      ],
      order: [
        ['type_id', 'ASC'],
        ['country', 'ASC']
      ]
    });
  }
}

module.exports = GiftCardService; 