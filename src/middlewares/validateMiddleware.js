'use strict';

const { validationResult } = require('express-validator');

/**
 * 数据验证中间件
 * 功能：
 * 1. 执行请求数据的验证规则
 * 2. 统一处理验证错误
 * 3. 格式化错误信息
 * 
 * 使用场景：
 * - 表单提交验证
 * - API 参数验证
 * - 数据格式检查
 * 
 * 特点：
 * - 支持多个验证规则
 * - 统一的错误返回格式
 * - 与 express-validator 配合使用
 * 
 * @param {Array} validations - express-validator 验证规则数组
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // 1. 执行所有验证规则
    await Promise.all(validations.map(validation => validation.run(req)));

    // 2. 获取验证结果
    const errors = validationResult(req);
    
    // 3. 处理验证错误
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    next();
  };
};

module.exports = validate; 