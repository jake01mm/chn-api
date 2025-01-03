'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { BadRequest } = require('http-errors');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads/gift-cards');
(async () => {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
})();

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const hash = crypto.createHash('md5')
      .update(`${timestamp}-${Math.random()}`)
      .digest('hex')
      .slice(0, 8);
    const ext = path.extname(file.originalname);
    cb(null, `gift-card-${hash}${ext}`);
  }
});

// Multer配置
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new BadRequest('只允许上传图片文件'));
    }
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new BadRequest('不支持的图片格式'));
    }
    cb(null, true);
  }
});

/**
 * 删除文件的工具函数
 * @param {string} filePath - 文件的完整路径
 * @returns {Promise<void>}
 */
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') { // 如果错误不是"文件不存在"
      throw error;
    }
  }
};

const singleGiftCardImage = upload.single('image');

module.exports = {
  singleGiftCardImage,
  uploadDir,
  deleteFile
};