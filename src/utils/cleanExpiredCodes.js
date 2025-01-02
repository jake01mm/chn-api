const { Op } = require('sequelize');
const VerificationCode = require('../models/verificationcode'); // 确保路径正确

const cleanExpiredCodes = async () => {
  try {
    const result = await VerificationCode.destroy({
      where: {
        expires_at: { [Op.lt]: new Date() }, // 删除过期的验证码
      },
    });
    console.log(`[${new Date().toISOString()}] Deleted ${result} expired verification codes.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error cleaning expired codes:`, error.message);
  }
};

// 如果直接运行此文件，则执行清理任务
if (require.main === module) {
  cleanExpiredCodes();
}

module.exports = cleanExpiredCodes;