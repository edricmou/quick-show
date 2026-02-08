# Quick Show 电影票预订系统

Quick Show 是一个全栈电影票预订系统，提供用户友好的界面来浏览电影、查看放映时间并预订座位。

## 功能特性

- **用户功能**
  - 浏览当前正在上映的电影
  - 查看详细电影信息（海报、剧情简介、演员等）
  - 选择日期和时间查看可用场次
  - 交互式座位选择布局
  - 个人预订管理
  - 收藏喜欢的电影

- **管理员功能**
  - 管理员仪表板
  - 添加新的电影放映时间
  - 管理现有放映
  - 查看所有预订记录

- **支付集成**
  - Stripe支付处理
  - 安全的在线付款

- **认证系统**
  - Clerk身份验证
  - 用户会话管理

## 技术栈

### 前端 (Client)
- React 19.x
- React Router DOM
- TailwindCSS
- Axios
- Clerk React
- React Hot Toast
- React Player

### 后端 (Server)
- Node.js
- Express 5.x
- MongoDB/Mongoose
- Clerk Express
- Stripe
- Cloudinary
- Inngest (用于后台任务处理)
- Nodemailer

## 项目结构

```
quick-show/
├── client/                 # React 前端应用
│   ├── src/
│   │   ├── components/     # 可复用UI组件
│   │   ├── pages/         # 页面组件
│   │   ├── context/       # React Context
│   │   ├── util/          # 工具函数
│   │   └── lib/           # 辅助函数库
├── server/                # Node.js 后端服务
│   ├── config/            # 配置文件
│   ├── controller/        # 控制器逻辑
│   ├── middleware/        # 中间件
│   ├── models/            # 数据模型
│   ├── routes/            # API路由
│   └── utils/             # 工具函数
```

## API 端点

### 电影相关
- `GET /api/show/now-playing` - 获取当前上映的电影
- `GET /api/show/all` - 获取所有电影
- `GET /api/show/:movieId` - 获取特定电影的场次信息

### 订票相关
- `POST /api/booking/book-seat` - 预订座位
- `GET /api/booking/get-user-bookings` - 获取用户预订信息

### 管理员相关
- `POST /api/admin/add-show` - 添加电影场次
- `GET /api/admin/list-shows` - 列出所有场次
- `GET /api/admin/list-bookings` - 列出所有预订
- `GET /api/admin/is-admin` - 检查管理员权限

### 用户相关
- `GET /api/user/favorites` - 获取收藏的电影
- `POST /api/user/add-to-favorite` - 添加到收藏
- `POST /api/user/remove-from-favorite` - 从收藏中移除

## 安装与运行

### 前端设置
```bash
cd client
npm install
npm run dev
```

### 后端设置
```bash
cd server
npm install
npm run server
```

### 环境变量

#### Client (.env)
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

#### Server (.env)
```
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
SVIX_SECRET=your_svix_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
TMDB_READ_ACCESS_TOKEN=your_tmdb_access_token
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

## 部署

项目已配置 Vercel 部署：
- 前端: `/client/vercel.json`
- 后端: `/server/vercel.json`

## 主要功能说明

1. **电影展示**: 从TMDB API获取最新的正在上映的电影
2. **场次管理**: 管理员可以添加电影放映时间和价格
3. **座位预订**: 交互式座位图，实时显示已预订座位
4. **支付处理**: 通过Stripe安全处理付款
5. **用户认证**: 使用Clerk进行用户管理和身份验证
6. **收藏功能**: 用户可以收藏喜欢的电影

## 贡献

欢迎提交 Pull Request 来改进项目。