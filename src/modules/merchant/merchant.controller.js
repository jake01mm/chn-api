'use strict';

const MerchantService = require('./merchant.service');
const logger = require('../../utils/logger');

class MerchantController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      logger.debug('Merchant login attempt:', email);
      
      const result = await MerchantService.login(email, password);
      res.json(result);
    } catch (error) {
      logger.error('Merchant login error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = MerchantController;