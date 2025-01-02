'use strict';

const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const logDir = path.join(__dirname, '../../logs');

// 确保日志目录存在
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 获取当前时间戳
const getTimestamp = () => new Date().toISOString();

// 写入文件日志
const writeToFile = (level, message) => {
  const logFile = path.join(logDir, `${level}.log`);
  const logMessage = `[${getTimestamp()}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
};

const logger = {
  db: (...args) => {
    if (isDev) {
      const message = `[DB]: ${args.join(' ')}`;
      console.log('\x1b[36m%s\x1b[0m', message); // 青色
      writeToFile('db', message);
    }
  },
  
  info: (...args) => {
    const message = `[INFO]: ${args.join(' ')}`;
    console.log('\x1b[32m%s\x1b[0m', message); // 绿色
    writeToFile('info', message);
  },
  
  error: (...args) => {
    const message = `[ERROR]: ${args.join(' ')}`;
    console.error('\x1b[31m%s\x1b[0m', message); // 红色
    writeToFile('error', message);
  },
  
  debug: (...args) => {
    if (isDev) {
      const message = `[DEBUG]: ${args.join(' ')}`;
      console.log('\x1b[33m%s\x1b[0m', message); // 黄色
      writeToFile('debug', message);
    }
  }
};

module.exports = logger; 