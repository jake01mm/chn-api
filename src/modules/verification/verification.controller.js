const VerificationService = require('./verification.service');

class VerificationController {
  /**
   * 发送验证码
   * @param {Request} req
   * @param {Response} res
   */
  static async sendCode(req, res) {
    try {
      const { email, type } = req.body;

      if (!email || !type) {
        return res.status(400).json({ error: 'Email and type are required' });
      }

      const result = await VerificationService.sendCode(email, type);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 验证验证码
   * @param {Request} req
   * @param {Response} res
   */
  static async verifyCode(req, res) {
    try {
      const { email, code, type } = req.body;

      if (!email || !code || !type) {
        return res.status(400).json({ error: 'Email, code, and type are required' });
      }

      const result = await VerificationService.verifyCode(email, code, type);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = VerificationController;