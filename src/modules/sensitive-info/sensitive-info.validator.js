'use strict';

const { body } = require('express-validator');

const sensitiveInfoValidator = {
  updateInfo: [
    body('first_name')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    
    body('last_name')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    
    body('bank_name')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Bank name must be between 2 and 100 characters'),
    
    body('bank_account')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Bank account must be between 5 and 100 characters')
  ],

  approve: [
    body('is_approved')
      .isBoolean()
      .withMessage('is_approved must be a boolean value'),
    
    body('reason')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Reason must not exceed 500 characters')
  ]
};

module.exports = {
  sensitiveInfoValidator
}; 