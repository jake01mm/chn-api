const schedule = require('node-schedule');
const cleanExpiredCodes = require('./cleanExpiredCodes');

// 每小时的第 0 分钟执行清理任务
schedule.scheduleJob('0 * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Running scheduled task: Clean expired verification codes.`);
  await cleanExpiredCodes();
});