'use strict';

const multer = require('multer');
const OSS = require('ali-oss');
const { BadRequest } = require('http-errors');
require('dotenv').config();

// 阿里云OSS配置
const config = {
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
};

// 创建OSS客户端实例
const client = new OSS(config);

// Multer内存存储配置
const storage = multer.memoryStorage();

// Multer配置
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制文件大小为5MB
  },
  fileFilter: function (req, file, cb) {
    // 检查文件类型
    if (!file.mimetype.startsWith('image/')) {
      return cb(new BadRequest('只允许上传图片文件'));
    }

    // 检查文件扩展名
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = file.originalname.toLowerCase().match(/\.[^.]+$/);
    
    if (!ext || !allowedExtensions.includes(ext[0])) {
      return cb(new BadRequest('不支持的图片格式。允许的格式：JPG, JPEG, PNG, GIF'));
    }

    cb(null, true);
  }
});

// 单文件上传中间件
const singleFileUpload = upload.single('file');

// 验证OSS配置并测试连接
async function validateOSSConnection() {
  try {
    await client.getBucketLocation();
    console.log('OSS connection successful');
    return true;
  } catch (error) {
    console.error('OSS connection failed:', error);
    return false;
  }
}

// 获取文件访问URL
async function getFileUrl(objectName) {
  try {
    const result = await client.generatePresignedUrl(objectName);
    return result;
  } catch (error) {
    console.error('Failed to generate file URL:', error);
    throw error;
  }
}

// 删除文件
async function deleteFile(objectName) {
  try {
    await client.delete(objectName);
    return true;
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
}

module.exports = {
  config,
  client,
  singleFileUpload,
  validateOSSConnection,
  getFileUrl,
  deleteFile
};