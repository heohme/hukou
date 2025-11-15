# Cloudflare Pages 部署指南

## 快速部署步骤

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare**
   - 访问 https://dash.cloudflare.com
   - 注册/登录账号（完全免费）

2. **连接 Git 仓库**
   - 进入 `Workers & Pages`
   - 点击 `Create application` → `Pages` → `Connect to Git`
   - 授权 GitHub/GitLab 账号
   - 选择 `hukou` 仓库

3. **配置构建设置**
   ```
   项目名称：beijing-jifen（或自定义）
   生产分支：main
   构建命令：npm run build
   构建输出目录：dist
   ```

4. **环境变量**（可选）
   ```
   NODE_VERSION = 18
   ```

5. **点击部署**
   - 等待 1-2 分钟自动构建
   - 获得免费域名：`https://your-project.pages.dev`

### 方法二：通过 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建项目
npm run build

# 部署到 Cloudflare Pages
wrangler pages deploy dist --project-name=beijing-jifen
```

## 自动部署

配置后，每次推送到 `main` 分支都会自动触发部署。

## 自定义域名（可选）

1. 在 Cloudflare Pages 项目设置中
2. 点击 `Custom domains`
3. 添加你的域名
4. 配置 DNS（Cloudflare 会自动引导）

## 特点

✅ **完全免费** - 无限带宽和请求
✅ **自动 HTTPS** - 自动配置 SSL 证书
✅ **全球 CDN** - 300+ 边缘节点
✅ **国内访问** - 相比 Vercel 访问更快
✅ **自动构建** - Git 提交自动部署
✅ **预览环境** - 每个 PR 独立预览链接

## 注意事项

- 首次部署约需 1-2 分钟
- 域名格式：`<项目名>.pages.dev`
- 支持绑定自定义域名
- 构建日志可在 Dashboard 查看

## 故障排查

**构建失败？**
- 检查 Node.js 版本是否为 18+
- 确认 `package.json` 中依赖完整
- 查看构建日志定位错误

**部署成功但页面空白？**
- 确认构建输出目录为 `dist`
- 检查浏览器控制台是否有报错
- 确认路由配置正确（SPA 应用）

## 相关链接

- Cloudflare Pages 文档：https://developers.cloudflare.com/pages
- Wrangler CLI：https://developers.cloudflare.com/workers/wrangler
