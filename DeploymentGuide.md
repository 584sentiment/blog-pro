# 博客部署指南 (Vercel + Turso)

由于 GitHub Pages 仅支持静态站点，我们将把你的博客迁移到 **Vercel**（用于托管网站和 API）和 **Turso**（用于托管云数据库）。

## 第一步：设置 Turso 数据库
1.  **安装 Turso CLI**：[点击此处查看安装指南](https://docs.turso.tech/cli/introduction)。
2.  **身份认证**：在终端输入 `turso auth login`。
3.  **导入本地数据（创建数据库）**：
    - 进入 `server/prisma/` 目录。
    - 首先将本地数据库切换为 WAL 模式：
      `sqlite3 dev.db "PRAGMA journal_mode=WAL;"`
    - 然后运行：`turso db create my-blog --from-file dev.db`
    - *注意：如果你之前已经创建了一个名为 `my-blog` 的空数据库，请先使用 `turso db destroy my-blog` 将其删除。*
4.  **获取连接详情**：
    - 数据库 URL：`turso db show my-blog --url`
    - 认证 Token：`turso db tokens create my-blog`
5.  **更新 `.env`**：将上述获取的值复制到你的 `server/.env` 文件中。

## 第二步：推送到 GitHub
1.  确保你所有的最新修改都已经 commit 并 push 到你的 GitHub 仓库。

## 第三步：部署到 Vercel
1.  **创建 Vercel 账号**：访问 [vercel.com](https://vercel.com) 并通过 GitHub 登录。
2.  **导入项目**：点击 "Add New" -> "Project"，然后选择你的博客仓库。
3.  **配置构建设置**：
    - Framework Preset: `Vite`
    - Build Command: `npm run build`
    - Output Directory: `dist`
4.  **环境变量**：在 Vercel 控制台的 Environment Variables 区域，添加以下变量：
    - `TURSO_DATABASE_URL`: (你获取的 Turso 数据库 URL)
    - `TURSO_AUTH_TOKEN`: (你获取的 Turso 认证 Token)
    - `DATABASE_URL`: (可以填入任意字符串，如 `sqlite://`。虽然我们使用了适配器，但 Prisma 依然要求这个参数不为空)
5.  **开始部署**：点击 "Deploy"。你的网站在几分钟内就会上线！

## 第四步：绑定自定义域名
1.  **进入设置**：在 Vercel 的项目控制面板中，点击顶部的 **Settings** 选项卡。
2.  **添加域名**：点击左侧栏的 **Domains**。
3.  **输入域名**：输入你的域名（例如 `www.yourdomain.com`）并点击 **Add**。
4.  **配置 DNS**：Vercel 会显示对应的 DNS 设置（通常是 `A` 记录或 `CNAME` 记录）。
    - 登录你的域名注册商（如阿里云、腾讯云、GoDaddy 等）。
    - 在域名的 DNS 管理页面添加 Vercel 提供的记录。
5.  **等待生效**：一旦 DNS 更新完成，Vercel 会自动签发 SSL 证书，你的域名就可以正常访问了！

## 日常维护
- 如果你想在本地管理云端数据，可以将本地的 `DATABASE_URL` 设置为你的 Turso URL（使用 `libsql://` 协议），或者直接使用 Turso 的官方控制台仪表板。
