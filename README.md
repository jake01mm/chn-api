
# chn-api

## 项目目录结构

```bash
chn-api/
├── src/
│   ├── config/ # 配置文件
│   │   └── config.js # 数据库配置
│   ├── middlewares/ # 中间件
│   │   ├── authMiddleware.js # 认证中间件
│   │   └── errorHandler.js # 错误处理
│   ├── models/ # 数据模型
│   │   ├── index.js
│   │   ├── user.js
│   │   ├── user_avatar.js
│   │   ├── user_sensitive_info.js
│   │   ├── verification_code.js
│   │   ├── gift_card.js
│   │   ├── gift_card_type.js
│   │   └── gift_card_image.js
│   ├── modules/ # 业务模块
│   │   ├── user/ # 用户模块
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   └── user.route.js
│   │   └── verification/ # 验证码模块
│   │       ├── verification.controller.js
│   │       ├── verification.service.js
│   │       └── verification.route.js
│   ├── utils/ # 工具函数
│   │   ├── logger.js # 日志工具
│   │   └── emailService.js # 邮件服务
│   ├── migrations/ # 数据库迁移文件
│   ├── seeders/ # 数据库种子文件
│   │   └── adminSeeder.js # 管理员账户初始化
│   ├── app.js # 应用程序配置
│   └── server.js # 服务器启动文件
├── .env # 环境变量
├── .gitignore # Git 忽略文件
├── package.json # 项目配置
└── README.md # 项目文档
```

---

## 环境变量

### 服务器配置
```env
PORT=3000
NODE_ENV=development
```

### 数据库配置
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=cardhubnow_db
```

### JWT 配置
```env
JWT_SECRET=your_jwt_secret_key
```

### Mailgun 配置
```env
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

### 邮件发送配置（开发环境）
```env
SKIP_EMAIL_SEND=true
```

### 管理员账户配置
```env
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

---

## 数据库操作

### 初始化 Sequelize 配置
```bash
npx sequelize-cli init
```

### 创建数据库
```bash
npx sequelize-cli db:create
```

### 运行所有迁移
```bash
npx sequelize-cli db:migrate
```

### 运行种子数据
```bash
npx sequelize-cli db:seed:all
```

### 撤销迁移和种子数据
```bash
# 撤销最后一次迁移
npx sequelize-cli db:migrate:undo

# 撤销所有迁移
npx sequelize-cli db:migrate:undo:all

# 撤销所有种子
npx sequelize-cli db:seed:undo:all
```

---

## API 路由

### 用户模块
- `POST /user/register` - 用户注册
- `POST /user/login` - 用户登录
- `POST /user/forgot-password` - 忘记密码
- `POST /user/reset-password` - 重置密码

### 验证模块
- `POST /verifications/send/:type` - 发送验证码
- `POST /verifications/verify` - 验证验证码

---

## 开发和运行

### 开发环境（使用 nodemon）
```bash
npm run dev
```

### 生产环境
```bash
npm start
```

---

## Sequelize 操作

### 创建模型和迁移
```bash
npx sequelize-cli model:generate --name User --attributes username:string
```

### 创建迁移
```bash
npx sequelize-cli migration:generate --name add-column-to-users
```

### 创建种子
```bash
npx sequelize-cli seed:generate --name demo-user
```

---

## 数据库操作命令

### MySQL 命令行
```bash
mysql -u root -p
```

---

## 常用命令

### 安装新包
```bash
npm install package-name
```

### 运行测试
```bash
npm test
```

---

## 许可证

MIT
