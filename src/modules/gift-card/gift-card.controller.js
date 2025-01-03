'use strict';

const GiftCardService = require('./gift-card.service');
const logger = require('../../utils/logger');

class GiftCardController {
  /**
   * 礼品卡类型管理
   */
  static async createType(req, res) {
    try {
      const data = {
        name: req.body.name,
        note: req.body.note,
        image_url: req.file ? `/uploads/gift-cards/${req.file.filename}` : null
      };
      const result = await GiftCardService.createType(data);
      res.status(201).json(result);
    } catch (error) {
      logger.error('Create gift card type error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async updateType(req, res) {
    try {
      const data = {
        name: req.body.name,
        note: req.body.note
      };
      if (req.file) {
        data.image_url = `/uploads/gift-cards/${req.file.filename}`;
      }
      const result = await GiftCardService.updateType(req.params.id, data);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Update gift card type error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteType(req, res) {
    try {
      await GiftCardService.deleteType(req.params.id);
      res.status(200).json({ message: 'Gift card type deleted successfully' });
    } catch (error) {
      logger.error('Delete gift card type error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllTypes(req, res) {
    try {
      const types = await GiftCardService.getAllTypes();
      res.status(200).json(types);
    } catch (error) {
      logger.error('Get gift card types error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 礼品卡价格管理
   */
  static async createCard(req, res) {
    try {
      const data = {
        type_id: req.params.typeId,
        ...req.body
      };
      const result = await GiftCardService.createCard(data);
      res.status(201).json(result);
    } catch (error) {
      logger.error('Create gift card error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async updateCard(req, res) {
    try {
      const result = await GiftCardService.updateCard(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Update gift card error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCard(req, res) {
    try {
      await GiftCardService.deleteCard(req.params.id);
      res.status(200).json({ message: 'Gift card deleted successfully' });
    } catch (error) {
      logger.error('Delete gift card error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllCards(req, res) {
    try {
      const cards = await GiftCardService.getAllCards(req.query);
      res.status(200).json(cards);
    } catch (error) {
      logger.error('Get gift cards error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = GiftCardController; 