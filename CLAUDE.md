# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个全栈博客系统，使用 React + TypeScript + Vite 作为前端，Express + Prisma + Turso 作为后端。

**技术栈：**
- 前端：React 19、TypeScript、Vite、React Router、Framer Motion、TipTap 编辑器
- 后端：Express、Prisma ORM、JWT 认证、bcrypt
- 数据库：Turso (基于 libsql SQLite)、本地开发使用 SQLite
- 部署：Vercel（前端 + API）、Turso（云数据库）
- UI：Sonner（Toast 通知）、Lucide React（图标）

## 开发命令

### 前端开发
```bash
npm run dev              # 仅启动前端开发服务器（端口 5173）
npm run build            # 构建前端到 dist/ 目录
npm run preview          # 预览构建后的前端
```

### 全栈开发（推荐）
```bash
npm run dev:all          # 同时启动前端和后端服务器
```

### 后端开发
```bash
npm run server:dev       # 启动后端开发服务器（端口 3001）
npm run server:build     # 构建后端 TypeScript 代码
npm run server:start     # 运行构建后的后端服务器
```

### 数据库
```bash
# Prisma 会自动在 postinstall 时生成客户端
# 如需手动生成：
npx prisma generate --schema=server/prisma/schema.prisma

# 创建/运行迁移（如有需要）
npx prisma migrate dev --schema=server/prisma/schema.prisma
```

### 其他
```bash
npm run lint             # 运行 ESLint 检查代码
```

## 项目架构

### 目录结构
```
blog-pro/
├── src/                    # 前端源代码
│   ├── components/         # React 组件
│   ├── pages/             # 页面组件（Home、Admin、Login、PostDetail）
│   ├── services/          # API 客户端
│   ├── assets/            # 静态资源
│   ├── App.tsx            # 主应用组件（路由配置）
│   └── main.tsx           # 入口文件
│
├── server/                # 后端源代码
│   ├── src/
│   │   └── index.ts       # Express 服务器主文件
│   ├── prisma/
│   │   ├── schema.prisma  # 数据库模型定义
│   │   └── dev.db         # 本地开发数据库（SQLite）
│   ├── .env               # 环境变量（不提交到 Git）
│   ├── tsconfig.json      # TypeScript 配置
│   └── dist/              # 编译后的 JS 代码
│
├── api/                   # Vercel Serverless Functions（如有）
├── public/                # 静态资源
└── vercel.json           # Vercel 部署配置
```

### 前端架构要点

**路由系统**（基于 React Router v7）：
- `/` - 首页（博客列表）
- `/post/:id` - 文章详情页
- `/login` - 管理员登录
- `/admin` - 管理后台（需认证，受 ProtectedRoute 保护）

**认证机制**：
- JWT Token 存储在 `localStorage.getItem('admin_token')`
- API 请求通过 `Authorization: Bearer <token>` 头部携带
- `api.isAuthenticated()` 检查登录状态
- 认证失败会抛出 'Unauthorized' 错误

**API 客户端**（`src/services/api.ts`）：
- 开发环境：`http://localhost:3001/api`
- 生产环境：`/api`（通过 Vercel rewrite 转发到 serverless 函数）
- 所有 API 调用统一通过 `api` 对象进行

**组件特性**：
- 使用 TipTap 富文本编辑器（在管理后台）
- Framer Motion 动画
- Sonner Toast 通知（`<Toaster />` 在 App.tsx 中）
- 路由 hash 滚动处理（`HashScrollHandler`）

### 后端架构要点

**认证中间件**（`server/src/index.ts:50-65`）：
- 验证 JWT Token
- 使用 `JWT_SECRET` 环境变量（默认：`ADMIN_PASSWORD` 或 `'secret-salt-123'`）
- Token 有效期：24 小时

**数据库模型**（`server/prisma/schema.prisma`）：
- `Post` - 博客文章
- `Project` - 项目展示
- `Friend` - 友情链接（支持审核机制，`approved` 字段）
- `Message` - 留言板
- `Song` - 音乐播放器歌曲列表

**API 端点**：
- `POST /api/auth/verify` - 管理员登录，返回 JWT
- `GET/POST/PUT/DELETE /api/posts` - 文章管理
- `GET/POST /api/projects` - 项目管理
- `GET /api/friends` - 获取已审核友链
- `POST /api/friends/apply` - 公共友链申请
- `GET /api/friends/pending` - 管理员查看待审核友链
- `PUT /api/friends/:id/approve` - 审核友链
- `GET/POST /api/messages` - 留言板
- `GET/POST /api/songs` - 音乐管理

**数据转换注意**：
- Project 的 `tags` 在数据库中存储为逗号分隔字符串，API 返回时会转换为数组
- Song 的 `lyrics` 存储为 JSON 字符串，API 返回时会解析为对象

### 环境变量配置

**本地开发**（`server/.env`）：
```bash
# 本地 SQLite 开发（默认）
DATABASE_URL=file:./prisma/dev.db

# 或连接 Turso 云数据库
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token
DATABASE_URL=file:./dev.db  # Prisma 要求非空

# 认证
ADMIN_PASSWORD=admin123  # 或 bcrypt hash
JWT_SECRET=your-secret-key
PORT=3001
```

**Vercel 生产环境**：
在 Vercel 控制台设置环境变量：
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `DATABASE_URL`（可填任意值）
- `ADMIN_PASSWORD` 或 `JWT_SECRET`

### 部署流程

**Vercel + Turso 部署**：
1. 设置 Turso 数据库（参考 `DeploymentGuide.md`）
2. 推送代码到 GitHub
3. 在 Vercel 导入项目
4. 配置环境变量
5. 自动部署

**Vercel 配置**（`vercel.json`）：
- `/api/*` 路由重写到 `/api/index.ts`（serverless 函数）
- 其他路由重写到 `/index.html`（前端 SPA）

**构建命令**：
```bash
npm run build
```
包含：Prisma 生成 → 后端编译 → 前端构建 → Vite 打包

## 重要注意事项

### 数据库迁移
- 本地使用 SQLite，生产使用 Turso（libsql）
- Turso 需要 `@prisma/adapter-libsql` 适配器
- 迁移数据到 Turso 时，需确保本地数据库先开启 WAL 模式：
  ```bash
  sqlite3 server/prisma/dev.db "PRAGMA journal_mode=WAL;"
  turso db create my-blog --from-file server/prisma/dev.db
  ```

### 认证安全
- 生产环境务必设置强 `JWT_SECRET` 或 bcrypt 加密的 `ADMIN_PASSWORD`
- Token 过期时间：24 小时（在 `server/src/index.ts:82`）

### 友链审核流程
1. 用户通过 `POST /api/friends/apply` 提交申请（`approved: false`）
2. 管理员在后台通过 `GET /api/friends/pending` 查看
3. 审核通过调用 `PUT /api/friends/:id/approve`（`approved: true`）
4. 公开接口 `GET /api/friends` 只返回已审核友链

### API 错误处理
- 前端捕获 401 错误并跳转登录（`api.ts:72, 81, 89...`）
- 后端统一返回 `{ error: "message" }` 格式
- 使用 `try-catch` 包裹所有 Prisma 操作

### 前端状态管理
- 无全局状态管理库（如 Redux/Zustand）
- 组件内部使用 React Hooks（useState、useEffect）
- 认证状态通过 localStorage + ProtectedRoute 管理

## 开发建议

1. **修改 API 端点**：
   - 后端：在 `server/src/index.ts` 修改路由
   - 前端：在 `src/services/api.ts` 添加对应方法

2. **添加新数据库模型**：
   - 在 `server/prisma/schema.prisma` 定义模型
   - 运行 `npx prisma generate`
   - 在 `server/src/index.ts` 添加 CRUD 端点
   - 在前端 `src/services/api.ts` 添加调用方法

3. **调试生产环境**：
   - 使用 Vercel 日志查看 serverless 函数错误
   - Turso 控制台查看数据库状态

4. **TipTap 编辑器**：
   - 管理后台使用富文本编辑器创建/编辑文章
   - 存储为 HTML 内容，前端渲染时需注意 XSS
