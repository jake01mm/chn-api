'use strict';

const { body } = require('express-validator');

const giftCardValidator = {
  createType: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('礼品卡名称不能为空')
      .isLength({ min: 2, max: 50 })
      .withMessage('名称长度必须在2-50个字符之间'),
    
    body('note')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('描述不能超过500个字符')
  ],

  updateType: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('名称长度必须在2-50个字符之间'),
    
    body('note')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('描述不能超过500个字符')
  ],

  createCard: [
    body('country')
      .trim()
      .notEmpty()
      .withMessage('国家代码不能为空')
      .isLength({ min: 2, max: 50 })
      .withMessage('国家代码长度必须在2-50个字符之间'),
    
    body('min')
      .notEmpty()
      .withMessage('最小面值不能为空')
      .isFloat({ min: 0 })
      .withMessage('最小面值必须是大于0的数字'),
    
    body('max')
      .notEmpty()
      .withMessage('最大面值不能为空')
      .isFloat({ min: 0 })
      .withMessage('最大面值必须是大于0的数字')
      .custom((value, { req }) => {
        if (parseFloat(value) <= parseFloat(req.body.min)) {
          throw new Error('最大面值必须大于最小面值');
        }
        return true;
      }),
    
    body('nairarate')
      .notEmpty()
      .withMessage('汇率不能为空')
      .isFloat({ min: 0 })
      .withMessage('汇率必须是大于0的数字')
  ],

  updateCard: [
    body('country')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('国家代码长度必须在2-50个字符之间'),
    
    body('min')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('最小面值必须是大于0的数字'),
    
    body('max')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('最大面值必须是大于0的数字')
      .custom((value, { req }) => {
        if (req.body.min && parseFloat(value) <= parseFloat(req.body.min)) {
          throw new Error('最大面值必须大于最小面值');
        }
        return true;
      }),
    
    body('nairarate')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('汇率必须是大于0的数字')
  ]
};

module.exports = {
  giftCardValidator
}; 