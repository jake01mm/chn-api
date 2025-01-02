'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { BadRequest } = require('http-errors');
const crypto = require('crypto');

// 确保基础上传目录存在
const baseUploadDir = path.join(__dirname, '../../uploads/avatars');
const types = ['user', 'merchant', 'admin'];
types.forEach(type => {
  const typeDir = path.join(baseUploadDir, type);
  if (!fs.existsSync(typeDir)) {
    fs.mkdirSync(typeDir, { recursive: true });
  }
});

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { type = 'user', id } = req.params;
    if (!types.includes(type)) {
      return cb(new Error('Invalid avatar type'));
    }

    // 为每个用户创建独立目录
    const userDir = path.join(baseUploadDir, type, id.toString());
    
    // 如果目录存在，删除旧文件
    if (fs.existsSync(userDir)) {
      const files = fs.readdirSync(userDir);
      for (const file of files) {
        fs.unlinkSync(path.join(userDir, file));
      }
    } else {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const timestamp = Date.now();
    const hash = crypto.createHash('md5')
      .update(`${req.params.id}-${timestamp}-${Math.random()}`)
      .digest('hex')
      .slice(0, 8);
    const ext = path.extname(file.originalname);
    cb(null, `${hash}${ext}`);
  }
});

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
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      return cb(new BadRequest('不支持的图片格式。允许的格式：JPG, JPEG, PNG, GIF'));
    }

    cb(null, true);
  }
});

// 单文件上传中间件
const singleFileUpload = upload.single('avatar');

// 删除文件
function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

module.exports = {
  singleFileUpload,
  deleteFile,
  baseUploadDir
}; 